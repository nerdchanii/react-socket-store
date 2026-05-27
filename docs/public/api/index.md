# API

The public package entrypoint exports React integration helpers:

- `SocketProvider`
- `useSocket`
- `useListen`
- `useSend`
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
import { useListen, useSend, useSocket } from "react-socket-store";
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
```

`useSocket(topic)` subscribes to one topic and returns the current topic state
plus a send function for the same topic.

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

The hook reads the store from `SocketProvider`. It resubscribes when the topic
key or provider store changes.

### useListen

Signature:

```ts
function useListen<
  Schema extends SocketSchema = DefaultSchema,
  K extends TopicKey<Schema> = TopicKey<Schema>
>(key: K): [TopicState<Schema, K>];
```

`useListen(topic)` subscribes to one topic and returns only the current state.

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
```

`useSend(topic)` returns only a send function for the selected topic.

```tsx
const [sendTalk] = useSend<ChatSchema, "talk">("talk");

sendTalk("hello");
```

The send function calls `store.send({ key, data })` with the selected topic.

### Lifecycle And Cleanup

- All current hooks require `SocketProvider`; store-direct hooks are not part of
  the current public API.
- Hooks throw `react-socket-store hooks must be used inside a SocketProvider.`
  when no provider store is available.
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
