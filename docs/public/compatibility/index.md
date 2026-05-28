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

For the framework-agnostic store contract, use the
[`socket-store` README](https://github.com/nerdchanii/socket-store#readme) and
[`socket-store` API contract](https://github.com/nerdchanii/socket-store/blob/main/docs/guide/api.md)
instead of treating this React adapter page as the source of truth. This page
only documents which core package version the adapter is expected to consume
and which behavior remains adapter-owned.

## Compatibility Table

| react-socket-store | socket-store | Status | Notes |
| --- | --- | --- | --- |
| `0.0.4` | `^0.0.2` | Supported current pairing | The adapter imports only from public package roots and keeps local adapter contract types for compatibility with the npm core release. |
| Future adapter release requiring new core behavior or public core types | Future npm `socket-store` release that contains that contract | Not supported until both packages are released | Do not publish or document a new adapter pairing until the required core version is available from npm and the migration notes name the minimum version. |

Do not import from generated `socket-store/dist/*` paths. Use package root
exports only.

The table only lists supported npm pairings and explicit unreleased boundaries.
It does not make local `socket-store` main-branch behavior available to
published `react-socket-store` consumers.

## Release Order

Release `socket-store` first when adapter work depends on new core behavior, new
public core types, or a higher minimum core version. After the core package is
available on npm, update `react-socket-store` to consume that public contract
through package-root exports and release the adapter.

Adapter-only docs, examples, hook tests, and React cleanup fixes can release
without a core release when they do not require a new core contract.

No breaking migration is required for the current compatibility boundary. The
current stabilization docs preserve the `react-socket-store@0.0.4` and
`socket-store@^0.0.2` package pairing.

If a future adapter release requires a newer core contract, document the
minimum `socket-store` version, dependency range change, import changes, and
React-visible hook or provider changes before publishing.

Maintainer release gates live in `docs/project/release-order.md`.
