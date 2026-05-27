# Guide

Create a `socket-store` store first with the public `SocketStore` constructor,
then pass it to `SocketProvider` near the root of the React tree that needs
socket state.

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

```tsx
import { SocketProvider } from "react-socket-store";

export function AppRoot({ store, children }) {
  return <SocketProvider store={store}>{children}</SocketProvider>;
}
```

Inside the provider, use the hooks for topic-specific state and sends:

- `useSocket(topic)` returns topic state and a send function.
- `useListen(topic)` returns topic state only.
- `useSend(topic)` returns a send function only.

Provide a schema type when you want TypeScript to connect topic names to state
and payload types.

Do not use `createSocketStore` in new docs or examples; it is not exported by
the current package.
