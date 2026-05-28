# Guide

Create a `socket-store` store first with the public `SocketStore` constructor.
After that, choose either `SocketProvider` for an SPA subtree that should read
one shared store from context, or store-direct hooks for components that already
own or receive the store.

```tsx
import {
  SocketProvider,
  SocketStore,
  createMessageHandler,
} from "react-socket-store";

const talkHandler = createMessageHandler<string[], string>(
  "talk",
  (state, message) => [...state, message],
  []
);

const store = new SocketStore(new WebSocket("ws://localhost:3000"), [
  talkHandler,
]);
```

## Provider Usage

`SocketProvider` is an optional SPA-friendly convenience. Use it when many
descendants in one client-rendered subtree should share the same store through
context.

```tsx
import { SocketProvider } from "react-socket-store";

export function RealtimeSubtree({ store, children }) {
  return <SocketProvider store={store}>{children}</SocketProvider>;
}
```

Inside the provider, use the one-argument hooks for topic-specific state and
sends:

- `useSocket(topic)` returns topic state and a send function.
- `useListen(topic)` returns topic state only.
- `useSend(topic)` returns a send function only.

Provide a schema type when you want TypeScript to connect topic names to state
and payload types.

Do not put `SocketProvider` at the app root just to make a small widget work.
If only one focused subtree needs realtime state, pass the store directly to
that subtree instead. In Next.js App Router, avoid putting `SocketProvider` in a
root layout when that would turn the layout and its imports into a Client
Component; see the [Next.js guide](../nextjs/) for client-boundary placement.

## Store-Direct Usage

Use store-direct hooks when a component already owns or receives a store
instance and adding `SocketProvider` would widen the React client boundary. This
is the preferred shape for focused client islands, tests, embedded widgets,
data-loader patterns, or code that must keep the realtime store close to one
mounted subtree.

```tsx
import {
  useListen,
  useSend,
  useSocket,
  type ISocketStore,
} from "react-socket-store";

type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

export function ChatClient({ store }: { store: ISocketStore<ChatSchema> }) {
  const [messages, sendTalk] = useSocket(store, "talk");

  return (
    <button type="button" onClick={() => sendTalk("hello")}>
      {messages.length}
    </button>
  );
}
```

The same explicit store argument works with the split hooks:

```tsx
function ChatSummary({ store }: { store: ISocketStore<ChatSchema> }) {
  const [messages] = useListen(store, "talk");
  const [sendTalk] = useSend(store, "talk");

  return (
    <button type="button" onClick={() => sendTalk("hello")}>
      {messages.join(", ")}
    </button>
  );
}
```

Create `WebSocket` and `SocketStore` instances in client lifecycle code that can
clean them up, then pass the store into store-direct components. Do not open a
socket inside `useSocketStoreRef`; React may discard render work before commit.
If a parent may replace the store prop, pass that prop directly so the hooks can
resubscribe to the new store. Use `useSocketStoreRef` only for a
side-effect-free store factory whose result should stay fixed for the component
lifetime.
`useListen` and `useSocket` unsubscribe from the selected topic when the
component unmounts or when the explicit store or topic changes.

Use `SocketProvider` when many SPA descendants should share the same store
through context. Use store-direct hooks when the store is already a prop or
when a small realtime island should not force an ancestor to become a provider.
For App Router placement and serializable server snapshots, see the
[Next.js guide](../nextjs/).

Do not use `createSocketStore` in new docs or examples; it is not exported by
the current package.
