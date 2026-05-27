# Next.js

`react-socket-store` hooks that create or consume WebSocket stores belong in
client-rendered components. In App Router projects, keep server-fetched data in
Server Components and pass initial snapshots into focused Client Components.

Prefer store-direct hooks for RSC client islands so a large layout does not need
to become a Client Component only to host `SocketProvider`. Pass a stable
client-owned store instance into the island; do not create user-specific stores
as request-shared server or module singletons.

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
