# Guide

Create a `socket-store` store first, then pass it to `SocketProvider` near the
root of the React tree that needs socket state.

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
