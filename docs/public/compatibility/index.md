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

For the framework-agnostic store behavior, use the
[`socket-store` docs](https://nerdchanii.github.io/socket-store/). This page
only documents supported package pairings and which behavior remains
adapter-owned.

## Compatibility Table

| react-socket-store | socket-store | Status | Notes |
| --- | --- | --- | --- |
| `0.0.5` | `^0.0.3` | Supported current pairing | Current documented pairing. |
| `0.0.4` | `^0.0.2` | Older pairing | Upgrade when you want the latest public docs and compatibility guidance. |

Do not import from generated `socket-store/dist/*` paths. Use package root
exports only.

The table only lists supported npm pairings. It does not make local
`socket-store` main-branch behavior available to published
`react-socket-store` consumers.
