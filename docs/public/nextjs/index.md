# Next.js

`react-socket-store` hooks that create or consume WebSocket stores belong in
client-rendered components. In App Router projects, keep server-fetched data in
Server Components and pass initial snapshots into focused Client Components.

Prefer store-direct hooks for RSC client islands so a large layout does not need
to become a Client Component only to host `SocketProvider`.

```tsx
"use client";

import { SocketStore, createMessageHandler, useSocket, useSocketStoreRef } from "react-socket-store";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

export function ChatClient({ initialMessages }: { initialMessages: string[] }) {
  const store = useSocketStoreRef(() => {
    const talkHandler = createMessageHandler<string[], string>(
      "talk",
      (state, message) => [...state, message],
      initialMessages
    );

    return new SocketStore(new WebSocket("ws://localhost:3000"), [talkHandler]);
  });

  const [messages, sendTalk] = useSocket<ChatSchema, "talk">(store, "talk");

  return (
    <button type="button" onClick={() => sendTalk("hello")}>
      {messages.length}
    </button>
  );
}
```

Do not create user-specific WebSocket stores as request-shared server or module
singletons. `SocketProvider` remains available for SPA compatibility, but it is
not required for client-owned store instances.
