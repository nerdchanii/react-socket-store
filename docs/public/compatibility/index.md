# Compatibility

`react-socket-store` is a React adapter over `socket-store`. The two packages
share a protocol, but they do not own the same behavior.

## Responsibility Split

`socket-store` owns framework-agnostic behavior:

- message handler keys, state, and payload handling
- `send({ key, data })` serialization
- `getState(key)` snapshots
- `subscribe(key, listener)` notification semantics
- unknown key and duplicate handler behavior
- WebSocket open, message, close, and error lifecycle callbacks

`react-socket-store` owns React behavior:

- `SocketProvider` context wiring
- `useListen`, `useSend`, and `useSocket`
- schema-safe hook state and payload types
- React subscription setup and cleanup through `useSyncExternalStore`

## Version Expectations

| react-socket-store | socket-store | Notes |
| --- | --- | --- |
| `0.0.4` | `^0.0.2` | Current package pairing. The adapter imports only from public package roots and keeps local adapter contract types for compatibility with the npm core release. |

Do not import from generated `socket-store/dist/*` paths. Use package root
exports only.

## Release Order

Release `socket-store` first when adapter work depends on new core behavior, new
public core types, or a higher minimum core version. After the core package is
available on npm, update `react-socket-store` to consume that public contract
through package-root exports and release the adapter.

Adapter-only docs, examples, hook tests, and React cleanup fixes can release
without a core release when they do not require a new core contract.

No breaking migration is required for the current compatibility boundary. If a
future adapter release requires a newer core contract, document the minimum
`socket-store` version and migration notes before publishing.

Maintainer release gates live in `docs/project/release-order.md`.
