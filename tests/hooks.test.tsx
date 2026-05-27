import React, { StrictMode } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  ISocketStore,
  SocketSchema,
  TopicKey,
  TopicPayload,
  TopicState,
  Unsubscribe,
} from "../src/types";
import { SocketProvider } from "../src/components/SocketProvider";
import { useListen } from "../src/components/hooks/useListen";
import { useSend } from "../src/components/hooks/useSend";
import { useSocket } from "../src/components/hooks/useSocket";
import { useSocketStoreRef } from "../src/components/hooks/useSocketStoreRef";
import { assertSocketStore } from "../src/components/context";

type TestSchema = {
  talk: {
    state: string[];
    payload: string;
  };
  trade: {
    state: number;
    payload: number;
  };
};

class FakeSocketStore<Schema extends SocketSchema>
  implements ISocketStore<Schema>
{
  private states: Partial<Record<TopicKey<Schema>, unknown>>;
  private listeners = new Map<
    TopicKey<Schema>,
    Set<(state: TopicState<Schema, TopicKey<Schema>>) => void>
  >();
  sent: Array<{ key: TopicKey<Schema>; data: unknown }> = [];
  subscriptions = 0;
  unsubscriptions = 0;

  constructor(states: { [K in TopicKey<Schema>]: TopicState<Schema, K> }) {
    this.states = states;
  }

  onConnect() {
    return undefined;
  }

  onMessage(_message: MessageEvent) {
    return undefined;
  }

  send<K extends TopicKey<Schema>>({
    key,
    data,
  }: {
    key: K;
    data: TopicPayload<Schema, K>;
  }) {
    this.sent.push({ key, data });
  }

  getState<K extends TopicKey<Schema>>(key: K): TopicState<Schema, K> {
    return this.states[key] as TopicState<Schema, K>;
  }

  subscribe<K extends TopicKey<Schema>>(
    key: K,
    listener: (state: TopicState<Schema, K>) => void
  ): Unsubscribe {
    const listeners = this.listeners.get(key) ?? new Set();
    listeners.add(
      listener as (state: TopicState<Schema, TopicKey<Schema>>) => void
    );
    this.listeners.set(key, listeners);
    this.subscriptions += 1;

    let subscribed = true;
    return () => {
      if (!subscribed) {
        return;
      }

      subscribed = false;
      listeners.delete(
        listener as (state: TopicState<Schema, TopicKey<Schema>>) => void
      );
      this.unsubscriptions += 1;
    };
  }

  setState<K extends TopicKey<Schema>>(key: K, state: TopicState<Schema, K>) {
    this.states[key] = state;
    const listeners = this.listeners.get(key);
    listeners?.forEach((listener) =>
      listener(state as TopicState<Schema, TopicKey<Schema>>)
    );
  }

  listenerCount<K extends TopicKey<Schema>>(key: K) {
    return this.listeners.get(key)?.size ?? 0;
  }
}

function createStore() {
  return new FakeSocketStore<TestSchema>({
    talk: ["hello"],
    trade: 1,
  });
}

function createWrapper(store: ISocketStore<TestSchema>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SocketProvider store={store}>{children}</SocketProvider>;
  };
}

describe("react-socket-store hooks", () => {
  it("throws a clear error outside SocketProvider", () => {
    expect(() => assertSocketStore(null)).toThrow(
      "react-socket-store hooks must be used inside a SocketProvider."
    );
  });

  it("reads the initial snapshot and updates after store notification", () => {
    const store = createStore();
    const { result } = renderHook(() => useListen<TestSchema, "talk">("talk"), {
      wrapper: createWrapper(store),
    });

    expect(result.current[0]).toEqual(["hello"]);

    act(() => {
      store.setState("talk", ["hello", "world"]);
    });

    expect(result.current[0]).toEqual(["hello", "world"]);
  });

  it("returns current state and a topic-specific send function", () => {
    const store = createStore();
    const { result } = renderHook(() => useSocket<TestSchema, "trade">("trade"), {
      wrapper: createWrapper(store),
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](42);
    });

    expect(store.sent).toEqual([{ key: "trade", data: 42 }]);
  });

  it("supports useSocket with an explicit store outside SocketProvider", () => {
    const store = createStore();
    const { result } = renderHook(() =>
      useSocket<TestSchema, "talk">(store, "talk")
    );

    expect(result.current[0]).toEqual(["hello"]);

    act(() => {
      store.setState("talk", ["direct"]);
      result.current[1]("message");
    });

    expect(result.current[0]).toEqual(["direct"]);
    expect(store.sent).toEqual([{ key: "talk", data: "message" }]);
  });

  it("supports split hooks with an explicit store outside SocketProvider", () => {
    const store = createStore();
    const { result } = renderHook(() => ({
      listen: useListen<TestSchema, "trade">(store, "trade"),
      send: useSend<TestSchema, "trade">(store, "trade"),
    }));

    expect(result.current.listen[0]).toBe(1);

    act(() => {
      result.current.send[0](7);
    });

    expect(store.sent).toEqual([{ key: "trade", data: 7 }]);
  });

  it("useSend sends the selected topic and payload", () => {
    const store = createStore();
    const { result } = renderHook(() => useSend<TestSchema, "talk">("talk"), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current[0]("message");
    });

    expect(store.sent).toEqual([{ key: "talk", data: "message" }]);
  });

  it("unsubscribes on unmount", () => {
    const store = createStore();
    const { unmount } = renderHook(
      () => useListen<TestSchema, "talk">("talk"),
      {
        wrapper: createWrapper(store),
      }
    );

    expect(store.listenerCount("talk")).toBe(1);

    unmount();

    expect(store.listenerCount("talk")).toBe(0);
    expect(store.unsubscriptions).toBe(1);
  });

  it("resubscribes when the topic key changes", () => {
    const store = createStore();
    const { result, rerender } = renderHook(
      ({ topic }: { topic: TopicKey<TestSchema> }) =>
        useListen<TestSchema>(topic),
      {
        initialProps: { topic: "talk" as TopicKey<TestSchema> },
        wrapper: createWrapper(store),
      }
    );

    expect(result.current[0]).toEqual(["hello"]);
    expect(store.listenerCount("talk")).toBe(1);

    rerender({ topic: "trade" });

    expect(result.current[0]).toBe(1);
    expect(store.listenerCount("talk")).toBe(0);
    expect(store.listenerCount("trade")).toBe(1);
  });

  it("balances StrictMode subscribe and unsubscribe calls", () => {
    const store = createStore();
    const wrapper = function Wrapper({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <StrictMode>
          <SocketProvider store={store}>{children}</SocketProvider>
        </StrictMode>
      );
    };

    const { unmount } = renderHook(
      () => useListen<TestSchema, "talk">("talk"),
      {
        wrapper,
      }
    );

    expect(store.listenerCount("talk")).toBe(1);

    unmount();

    expect(store.listenerCount("talk")).toBe(0);
    expect(store.subscriptions).toBe(store.unsubscriptions);
  });

  it("creates a stable store ref once per component instance", () => {
    const stores = [createStore(), createStore()];
    const { result, rerender } = renderHook(() =>
      useSocketStoreRef<TestSchema>(() => stores.shift() ?? createStore())
    );
    const firstStore = result.current;

    rerender();

    expect(result.current).toBe(firstStore);
    expect(stores).toHaveLength(1);
  });
});
