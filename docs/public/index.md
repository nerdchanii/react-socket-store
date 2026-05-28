# react-socket-store

`react-socket-store` connects `socket-store` to React with a provider and hooks
for reading topic state, sending payloads, and cleaning up subscriptions in
components.

Use it when you already have a `SocketStore` instance and want a React-friendly
way to share it through context or pass it directly into a focused client
subtree.

## Install

```sh
npm install react-socket-store socket-store
```

## Getting Started

Create the `SocketStore` first, then choose either `SocketProvider` or the
store-direct hooks:

```tsx
import { useEffect, useState } from "react";
import {
  SocketProvider,
  SocketStore,
  createMessageHandler,
  useSocket,
  type ISocketStore,
} from "react-socket-store";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

function ChatMessages() {
  const [messages, sendTalk] = useSocket<ChatSchema, "talk">("talk");

  return (
    <button type="button" onClick={() => sendTalk("hello")}>
      Messages: {messages.length}
    </button>
  );
}

export function ChatBoundary() {
  const [store, setStore] = useState<ISocketStore<ChatSchema> | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/chat");
    const nextStore = new SocketStore(socket, [
      createMessageHandler<string[], string>(
        "talk",
        (messages, message) => [...messages, message],
        []
      ),
    ]) as unknown as ISocketStore<ChatSchema>;

    setStore(nextStore);

    return () => {
      socket.close();
    };
  }, []);

  if (store === null) {
    return null;
  }

  return (
    <SocketProvider store={store}>
      <ChatMessages />
    </SocketProvider>
  );
}
```

## Choose An Integration Shape

- [Guide](./guide/): provider setup, store-direct hooks, and cleanup guidance.
- [Examples](./examples/): provider, store-direct, and Next.js usage patterns.
- [API](./api/): exported hooks, provider types, and adapter surface.
- [Next.js](./nextjs/): client-boundary guidance for App Router projects.
- [Compatibility](./compatibility/): version pairing and package ownership.
- [Migration](./migration/): current migration notes and boundary changes.

## What This Package Owns

`react-socket-store` owns the React adapter layer: `SocketProvider`,
store-direct hooks, `useSocketStoreRef`, schema-safe hook types, and React
subscription cleanup.

The framework-agnostic WebSocket behavior still belongs to
[`socket-store`](https://nerdchanii.github.io/socket-store/).
