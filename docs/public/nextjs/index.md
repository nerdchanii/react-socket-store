# Next.js

`react-socket-store` hooks that create or consume WebSocket stores belong in
client-rendered components. In App Router projects, keep server-fetched data in
Server Components and pass initial snapshots into focused Client Components.
This follows the current Next.js App Router model: pages and layouts are Server
Components by default, while files that use hooks, effects, event handlers, or
browser APIs must opt into the client boundary with `"use client"`.

## Server And Client Responsibilities

Server Components can fetch request-scoped data, read cookies or headers, and
prepare serializable initial snapshots. They must not create `WebSocket`
instances, `SocketStore` instances, React context providers, or call
`react-socket-store` hooks.

Client Components own the realtime boundary. Put `"use client"` on the file
that creates or consumes the WebSocket store, calls `useSocket`, `useListen`,
`useSend`, or renders `SocketProvider`. This matches the App Router client
boundary: Client Component props must be serializable, while hooks, state,
effects, event handlers, and browser APIs stay on the client.

Prefer store-direct hooks for RSC client islands so a large layout does not need
to become a Client Component only to host `SocketProvider`. Keep providers and
store owners close to the realtime UI; placing `SocketProvider` in a root layout
turns that layout file and its imports into the client bundle.

Do not create global user-specific stores on the server or in shared modules.
Those stores can leak request data between users and cannot cross the RSC
serialization boundary. Next.js request memoization and opt-in data caching are
for application data fetching, not for sharing a mutable `SocketStore` that
contains user-specific realtime state.

Use this placement rule for App Router code:

- Server Components may fetch data and pass serializable initial snapshots.
- Client Components may create `WebSocket` and `SocketStore` instances.
- Client Components may call `useSocket`, `useListen`, `useSend`, and
  `useSocketStoreRef`.
- Shared modules must not hold request-specific or user-specific store
  singletons.

## Client Island With Initial Snapshot

Pass only the snapshot from the Server Component:

```tsx
// app/chat/page.tsx
import { ChatIsland } from "./ChatIsland";

export default async function Page() {
  const initialMessages = await getInitialMessages();

  return <ChatIsland initialMessages={initialMessages} />;
}
```

Then create the WebSocket-backed store inside the client island lifecycle and
seed the topic handler with that snapshot:

```tsx
// app/chat/ChatIsland.tsx
"use client";

import { useEffect, useState } from "react";
import { SocketStore, createMessageHandler } from "react-socket-store";
import { ChatClient } from "./ChatClient";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

export function ChatIsland({ initialMessages }: { initialMessages: string[] }) {
  const [store, setStore] = useState<SocketStore<ChatSchema> | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/chat");
    const nextStore = new SocketStore<ChatSchema>(socket, [
      createMessageHandler<string[], string, "talk">(
        "talk",
        (state, message) => [...state, message],
        [...initialMessages]
      ),
    ]);

    setStore(nextStore);

    return () => {
      nextStore.dispose();
      socket.close();
    };
  }, [initialMessages]);

  if (store === null) {
    return <p>{initialMessages.length}</p>;
  }

  return <ChatClient store={store} />;
}
```

The server-owned value is the serializable `initialMessages` array. The client
island creates one store per mounted realtime boundary, and the first
`useSocket` read observes the handler's initial state through
`store.getState("talk")`. `ChatClient` can then use the store-direct hooks shown
below without widening the client boundary to a root layout.

## Store-Direct Hooks

```tsx
"use client";

import { useSocket, useSocketStoreRef, type ISocketStore } from "react-socket-store";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

export function ChatClient({ store }: { store: ISocketStore<ChatSchema> }) {
  const stableStore = useSocketStoreRef(() => store);
  const [messages, sendTalk] = useSocket(stableStore, "talk");

  return (
    <button type="button" onClick={() => sendTalk("hello")}>
      {messages.length}
    </button>
  );
}
```

`useSocketStoreRef` must not open a `WebSocket` during render. Create external
resources in application lifecycle code that can clean them up, then pass the
resulting store into the client island. `SocketProvider` remains available for
SPA compatibility, but it is not required for client-owned store instances.

Initial server-fetched snapshots should seed the per-client store before the
store reaches `useSocketStoreRef`. Keep the snapshot serializable across the RSC
boundary, create a new store for each client-owned realtime boundary, and avoid
module-level stores for user-specific data. The first `useSocket` or `useListen`
read uses the store's current `getState(topic)` snapshot, so the hook does not
need a separate initial-state option.

For the store-direct hook signatures, see the [API guide](../api/#hook-api).
For a shorter provider-based example that mirrors the runnable Vite demo shape,
see the [examples guide](../examples/).
