# Migration

No breaking migration is required for the current documented pairing.

If you are upgrading to the latest public docs baseline, use:

- `react-socket-store@0.0.5`
- `socket-store@^0.0.3`

Existing consumers on `react-socket-store@0.0.4` can stay on
`socket-store@^0.0.2` until they are ready to move both packages together.

Use public package entrypoints when moving code onto the stabilized adapter:

- Import React helpers from `react-socket-store`.
- Import core store helpers from `socket-store`.
- Do not import from generated `socket-store/dist/*` paths.
- Replace legacy or draft `createSocketStore(...)` examples with direct
  `new SocketStore(...)` construction.
- Pass an existing store directly to `useSocket`, `useListen`, or `useSend`
  when only one focused React subtree needs realtime state.
- Use `SocketProvider` as a scoped context convenience for SPA subtrees that
  share one store; do not widen server-rendered or data-loader boundaries only
  to provide socket state.

Keep React adapter docs focused on provider setup, hook behavior, render timing,
subscription cleanup, and schema-safe hook usage. Link to `socket-store` for
core WebSocket topic-store behavior.

## Current Notes

The current docs clarify existing package boundaries rather than changing the
runtime contract:

- `socket-store` remains responsible for WebSocket topic-store behavior,
  message handler validation, state snapshots, sending, subscriptions, and
  connection lifecycle callbacks.
- `react-socket-store` remains responsible for React context wiring,
  store-direct hooks, schema-safe hook types, and subscription cleanup through
  `useSyncExternalStore`.
- The latest adapter pairing uses `socket-store@^0.0.3`.
- Local adapter contract types remain in `react-socket-store` until a future
  `socket-store` npm release exposes the stronger adapter-facing type surface.

See [Compatibility](../compatibility/) for the package responsibility split,
current version pairing, and supported package combinations.
