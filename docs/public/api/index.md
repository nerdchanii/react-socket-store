# API

The public package entrypoint exports React integration helpers:

- `SocketProvider`
- `useSocket`
- `useListen`
- `useSend`
- `useSocketStoreRef`
- `SocketStore`
- `createMessageHandler`

## Store Creation

Create stores with the public `SocketStore` class:

```ts
import { SocketStore, createMessageHandler } from "react-socket-store";

const talkHandler = createMessageHandler<string[], string>(
  "talk",
  (state, message) => [...state, message],
  []
);

const store = new SocketStore(new WebSocket("ws://localhost:3000"), [
  talkHandler,
]);
```

`createSocketStore` is not a public export of the current package. Do not use it
in new examples.

## Hook API

Import hooks from the package root:

```ts
import {
  useListen,
  useSend,
  useSocket,
  useSocketStoreRef,
} from "react-socket-store";
```

### useSocket

Signature:

```ts
function useSocket<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(
  key: K
): [TopicState<Schema, K>, (message: TopicPayload<Schema, K>) => void];

function useSocket<Schema extends SocketSchema, K extends TopicKey<Schema>>(
  store: SocketStoreLike<Schema>,
  key: K
): [TopicState<Schema, K>, (message: TopicPayload<Schema, K>) => void];
```

`useSocket(topic)` subscribes to one topic and returns the current topic state
plus a send function for the same topic. `useSocket(store, topic)` does the
same work against an explicit store instance and does not require
`SocketProvider`.

```tsx
type ChatSchema = {
  talk: {
    state: string[];
    payload: string;
  };
};

const [messages, sendTalk] = useSocket<ChatSchema, "talk">("talk");

sendTalk("hello");
```

The one-argument form reads the store from `SocketProvider`. Both forms
resubscribe when the topic key or store changes.

### useListen

Signature:

```ts
function useListen<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(key: K): [TopicState<Schema, K>];

function useListen<Schema extends SocketSchema, K extends TopicKey<Schema>>(
  store: SocketStoreLike<Schema>,
  key: K
): [TopicState<Schema, K>];
```

`useListen(topic)` subscribes to one topic and returns only the current state.
`useListen(store, topic)` uses an explicit store without provider context.

```tsx
const [messages] = useListen<ChatSchema, "talk">("talk");
```

The hook uses `useSyncExternalStore`, so React reads snapshots through
`store.getState(key)` and subscribes through `store.subscribe(key, listener)`.

### useSend

Signature:

```ts
function useSend<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(
  key: K
): [(message: TopicPayload<Schema, K>) => void];

function useSend<Schema extends SocketSchema, K extends TopicKey<Schema>>(
  store: SocketStoreLike<Schema>,
  key: K
): [(message: TopicPayload<Schema, K>) => void];
```

`useSend(topic)` returns only a send function for the selected topic.
`useSend(store, topic)` sends through an explicit store without provider
context.

```tsx
const [sendTalk] = useSend<ChatSchema, "talk">("talk");

sendTalk("hello");
```

The send function calls `store.send({ key, data })` with the selected topic.

### useSocketStoreRef

Signature:

```ts
function useSocketStoreRef<
  Schema extends SocketSchema = DefaultSchema,
  Store extends SocketStoreLike<Schema> = SocketStoreLike<Schema>
>(createStore: () => Store): Store;
```

`useSocketStoreRef(createStore)` stores the result of a side-effect-free factory
for the component instance and returns the same store across re-renders. Use it
only with a precreated store reference or another pure factory. Do not open a
`WebSocket` or allocate external resources inside this factory because React can
discard render attempts before commit.

For Next.js App Router, keep user-specific stores client-owned and pass only
serializable server snapshots across the RSC boundary. See the
[Next.js guide](../nextjs/#server-and-client-responsibilities).

```tsx
function ChatClient({ store }: { store: ISocketStore<ChatSchema> }) {
  const stableStore = useSocketStoreRef(() => store);
  const [messages, sendTalk] = useSocket(stableStore, "talk");

  sendTalk("hello");

  return <p>{messages.join(", ")}</p>;
}
```

### Lifecycle And Cleanup

- One-argument hooks require `SocketProvider`.
- Store-direct hooks accept an explicit store and do not read provider context.
- One-argument hooks throw
  `react-socket-store hooks must be used inside a SocketProvider.` when no
  provider store is available.
- `useListen` and `useSocket` clean up by calling the unsubscribe function
  returned by `store.subscribe` when one is provided.
- The currently published `socket-store@0.0.2` subscribe declaration returns
  `void`, so stronger cleanup guarantees depend on the cross-package contract
  work tracked in project docs and tests.
- Unknown topic runtime behavior is not guaranteed. Use a schema type when you
  want TypeScript to constrain topic names and payloads.

The adapter relies on the public `socket-store` package for core store,
message-handler, WebSocket lifecycle, and protocol behavior. Core-only docs may
import core helpers from `socket-store`; adapter docs can use the
`react-socket-store` root re-exports. Never import from generated build paths.

For exact runtime behavior, inspect the package source and tests:

- `src/components/SocketProvider.tsx`
- `src/components/context.ts`
- `src/components/hooks/`
- `tests/`
- `test-d/`
