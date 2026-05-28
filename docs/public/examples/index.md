# Examples

Choose the example that matches how your app owns the realtime store.

## Local Vite App

Use this example when you want the smallest runnable browser app with
`SocketProvider` and a local WebSocket server.

Key idea:

- one browser app owns one store and shares it through `SocketProvider`
- a local server echoes topic messages so you can test the full flow quickly

The Vite example includes a minimal local WebSocket echo server, so it does not
need external infrastructure. From `example/`, install dependencies, then run
the server and browser app in separate terminals:

```bash
npm install
npm run server
```

```bash
npm run dev
```

The app connects to `ws://localhost:3000`. When the chat form submits, the
client sends a `socket-store` topic message shaped like
`{ "key": "talk", "data": "<message>" }`. The local server echoes valid topic
messages back to the same client, and the `talk` message handler appends the
payload to the visible chat state.

Closing the browser tab closes the WebSocket connection. Stopping the local
server with `Ctrl+C` closes any connected example clients. Run
`npm run build` from `example/` after building the package root to verify the
example app.

A minimal component can subscribe and send through one topic:

```tsx
import { useSocket } from "react-socket-store";

export function TalkBox() {
  const [messages, send] = useSocket("talk");

  return (
    <button type="button" onClick={() => send("hello")}>
      Messages: {messages.length}
    </button>
  );
}
```

## React Router Loader Initial Snapshot

Use this example when route loader data should seed the first render, but the
browser route still owns the realtime socket after mount.

Key idea:

- the loader returns only serializable snapshot data
- the client route creates the store and passes it directly to store-direct
  hooks

React Router data loaders can fetch the request-scoped initial snapshot before
the route renders. Pass that serializable data into a client-owned realtime
component, create the store after mount, and use store-direct hooks instead of
adding a `SocketProvider` boundary around the route.

```tsx
// routes/chat.tsx
import { useLoaderData } from "react-router";
import { ChatRouteClient } from "./ChatRouteClient";

type Message = {
  id: string;
  text: string;
};

export async function loader() {
  const response = await fetch("/api/chat");
  const initialMessages: Message[] = await response.json();

  return { initialMessages };
}

export function ChatRoute() {
  const { initialMessages } = useLoaderData<typeof loader>();

  return <ChatRouteClient initialMessages={initialMessages} />;
}
```

The route component passes only loader data. The client component owns the
`WebSocket` and creates a new `SocketStore` for this mounted route instance:

```tsx
// routes/ChatRouteClient.tsx
import { useEffect, useState } from "react";
import {
  SocketStore,
  createMessageHandler,
  type ISocketStore,
} from "react-socket-store";
import { ChatThread, type Message } from "./ChatThread";

type ChatSchema = {
  talk: {
    state: Message[];
    payload: Message;
  };
};

export function ChatRouteClient({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [store, setStore] = useState<ISocketStore<ChatSchema> | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/chat");
    const nextStore = new SocketStore(socket, [
      createMessageHandler<Message[], Message>(
        "talk",
        (messages, message) => [...messages, message],
        [...initialMessages]
      ),
    ]) as unknown as ISocketStore<ChatSchema>;

    setStore(nextStore);

    return () => {
      socket.close();
    };
  }, [initialMessages]);

  if (store === null) {
    return <p>Messages: {initialMessages.length}</p>;
  }

  return <ChatThread store={store} />;
}
```

`ChatThread` reads the seeded snapshot first, then receives realtime updates
from the same store. It does not need provider context:

```tsx
// routes/ChatThread.tsx
import { FormEvent, useState } from "react";
import { useSocket, type ISocketStore } from "react-socket-store";

export type Message = {
  id: string;
  text: string;
};

type ChatSchema = {
  talk: {
    state: Message[];
    payload: Message;
  };
};

export function ChatThread({ store }: { store: ISocketStore<ChatSchema> }) {
  const [draft, setDraft] = useState("");
  const [messages, sendTalk] = useSocket(store, "talk");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendTalk({ id: crypto.randomUUID(), text: draft });
    setDraft("");
  }

  return (
    <form onSubmit={submit}>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <input value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}
```

Message flow:

1. The React Router loader fetches the route's initial messages.
2. `ChatRouteClient` renders the loader snapshot count while the browser store
   is being created.
3. The `talk` handler seeds the new client-owned store with the loader snapshot
   before `ChatThread` subscribes.
4. `ChatThread` uses `useSocket(store, "talk")` so incoming socket messages
   update the same topic state without `SocketProvider`.
5. Unmounting or revalidation cleanup closes the route-owned socket; hook
   subscriptions clean up when the store provides unsubscribe callbacks.

Do not put a user-specific `SocketStore` in a route module, shared module, or
server singleton. For hook signatures, see the [API guide](../api/#hook-api).
For equivalent server/client placement in App Router, see the
[Next.js guide](../nextjs/).

## Next.js App Router Client Island

Use this example when a Server Component should fetch request data and a
focused Client Component island should own the realtime connection.

Key idea:

- the server passes a serializable snapshot across the RSC boundary
- the client island creates and cleans up the `WebSocket` and `SocketStore`

In App Router, keep request-scoped data fetching in the Server Component and
create the realtime store inside a focused Client Component island.

```tsx
// app/chat/page.tsx
import { ChatIsland } from "./ChatIsland";

type Message = {
  id: string;
  text: string;
};

async function getInitialMessages(): Promise<Message[]> {
  const response = await fetch("https://example.com/api/chat", {
    cache: "no-store",
  });

  return response.json();
}

export default async function Page() {
  const initialMessages = await getInitialMessages();

  return <ChatIsland initialMessages={initialMessages} />;
}
```

The server passes only serializable data across the RSC boundary. The client
island owns the `WebSocket` and `SocketStore` lifecycle:

```tsx
// app/chat/ChatIsland.tsx
"use client";

import { useEffect, useState } from "react";
import {
  SocketStore,
  createMessageHandler,
  type ISocketStore,
} from "react-socket-store";
import { ChatClient, type Message } from "./ChatClient";

type ChatSchema = {
  talk: {
    state: Message[];
    payload: Message;
  };
};

export function ChatIsland({
  initialMessages,
}: {
  initialMessages: Message[];
}) {
  const [store, setStore] = useState<ISocketStore<ChatSchema> | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://example.com/chat");
    const nextStore = new SocketStore(socket, [
      createMessageHandler<Message[], Message>(
        "talk",
        (messages, message) => [...messages, message],
        initialMessages
      ),
    ]) as unknown as ISocketStore<ChatSchema>;

    setStore(nextStore);

    return () => {
      socket.close();
    };
  }, [initialMessages]);

  if (store === null) {
    return <p>Messages: {initialMessages.length}</p>;
  }

  return <ChatClient store={store} />;
}
```

The child component can use the store-direct hook overload, so no root layout
has to become a Client Component only to host `SocketProvider`:

```tsx
// app/chat/ChatClient.tsx
"use client";

import { FormEvent, useState } from "react";
import { useSocket, type ISocketStore } from "react-socket-store";

export type Message = {
  id: string;
  text: string;
};

type ChatSchema = {
  talk: {
    state: Message[];
    payload: Message;
  };
};

export function ChatClient({ store }: { store: ISocketStore<ChatSchema> }) {
  const [draft, setDraft] = useState("");
  const [messages, sendTalk] = useSocket(store, "talk");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendTalk({ id: crypto.randomUUID(), text: draft });
    setDraft("");
  }

  return (
    <form onSubmit={submit}>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <input value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}
```

Message flow:

1. `app/chat/page.tsx` fetches request-scoped initial messages on the server.
2. `ChatIsland` receives that snapshot as props and creates one client-owned
   store for the mounted realtime boundary.
3. The `talk` handler seeds the store with the server snapshot before
   `ChatClient` subscribes.
4. `ChatClient` reads and sends through `useSocket(store, "talk")`; incoming
   socket messages update the same topic state.

Do not put a user-specific `SocketStore` in a shared module or Server Component.
For more App Router placement rules, see the [Next.js guide](../nextjs/).
