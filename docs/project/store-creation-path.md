# Store Creation Path

## Decision

The official store creation path for `react-socket-store` docs is direct
construction with the public `SocketStore` class:

```ts
const store = new SocketStore(webSocket, messageHandlers, options);
```

`createSocketStore` is not a public export of the current adapter package and
should not be shown as the primary path.

## Import Guidance

- Adapter quick starts may import `SocketStore` and `createMessageHandler` from
  `react-socket-store` because the adapter root re-exports both public core
  helpers.
- Core-only docs may import them from `socket-store`.
- Do not import from generated `socket-store/dist/*` paths.

## Follow-Up

If a factory API is added later, it needs its own API issue, tests, and
cross-package release plan before docs present it as supported.
