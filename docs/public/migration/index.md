# Migration

Use public package entrypoints when moving code onto the stabilized adapter:

- Import React helpers from `react-socket-store`.
- Import core store helpers from `socket-store`.
- Do not import from generated `socket-store/dist/*` paths.
- Replace legacy or draft `createSocketStore(...)` examples with direct
  `new SocketStore(...)` construction.

Keep React adapter docs focused on provider setup, hook behavior, render timing,
subscription cleanup, and schema-safe hook usage. Link to `socket-store` for
core WebSocket topic-store behavior.

Before publishing an adapter release that raises the required `socket-store`
contract, add migration notes that name the minimum compatible `socket-store`
version, dependency range changes, import changes, React hook or provider
behavior changes, and any removed or deferred support.

See [Compatibility](../compatibility/) for the package responsibility split,
current version pairing, and cross-package release order.
