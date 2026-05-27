# API

The public package entrypoint exports React integration helpers:

- `SocketProvider`
- `useSocket`
- `useListen`
- `useSend`

The adapter relies on the public `socket-store` package for core store,
message-handler, WebSocket lifecycle, and protocol behavior. Import core store
types and constructors from `socket-store`, not from generated build paths.

For exact runtime behavior, inspect the package source and tests:

- `src/components/SocketProvider.tsx`
- `src/components/context.ts`
- `src/components/hooks/`
- `tests/`
- `test-d/`
