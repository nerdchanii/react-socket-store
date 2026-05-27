import React from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocketStore, createMessageHandler } from "socket-store";
import {
  SocketProvider,
  useListen,
  useSend,
  useSocket,
  type ISocketStore,
} from "../src";

type CoreSchema = {
  talk: {
    state: string[];
    payload: string;
  };
  trade: {
    state: number;
    payload: number;
  };
};

class TestWebSocket {
  sent: string[] = [];

  addEventListener() {
    return undefined;
  }

  send(message: string) {
    this.sent.push(message);
  }
}

function createCoreFixture() {
  const socket = new TestWebSocket();
  const talkHandler = createMessageHandler<string[], string>(
    "talk",
    (state, message) => [...state, message],
    []
  );
  const tradeHandler = createMessageHandler<number, number>(
    "trade",
    (_state, message) => message,
    0
  );
  const store = new SocketStore(socket as unknown as WebSocket, [
    talkHandler,
    tradeHandler,
  ]);

  return {
    socket,
    store: store as unknown as ISocketStore<CoreSchema> & {
      onMessage(message: MessageEvent<string>): void;
    },
  };
}

function createWrapper(store: ISocketStore<CoreSchema>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SocketProvider store={store}>{children}</SocketProvider>;
  };
}

describe("socket-store public contract fixture", () => {
  it("reads and updates topic state through a public core store", () => {
    const { store } = createCoreFixture();
    const { result } = renderHook(() => useListen<CoreSchema, "talk">("talk"), {
      wrapper: createWrapper(store),
    });

    expect(result.current[0]).toEqual([]);

    act(() => {
      store.onMessage(
        new MessageEvent("message", {
          data: JSON.stringify({ key: "talk", data: "hello" }),
        })
      );
    });

    expect(result.current[0]).toEqual(["hello"]);
  });

  it("sends topic payloads through the public core send shape", () => {
    const { socket, store } = createCoreFixture();
    const { result } = renderHook(() => useSend<CoreSchema, "trade">("trade"), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current[0](42);
    });

    expect(socket.sent.map((message) => JSON.parse(message))).toEqual([
      { key: "trade", data: 42 },
    ]);
  });

  it("combines core state reads and sends through useSocket", () => {
    const { socket, store } = createCoreFixture();
    const { result } = renderHook(() => useSocket<CoreSchema, "talk">("talk"), {
      wrapper: createWrapper(store),
    });

    expect(result.current[0]).toEqual([]);

    act(() => {
      result.current[1]("from hook");
    });

    expect(socket.sent.map((message) => JSON.parse(message))).toEqual([
      { key: "talk", data: "from hook" },
    ]);
  });
});
