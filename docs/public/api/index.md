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
