# socket-store Contract Map

This map records which `socket-store` contracts `react-socket-store` relies on
before later API, testing, and documentation work continues.

## Sources Checked

- `src/index.ts`
- `src/types.ts`
- `src/components/SocketProvider.tsx`
- `src/components/context.ts`
- `src/components/hooks/`
- `tests/hooks.test.tsx`
- `test-d/hooks.test-d.tsx`
- Installed `socket-store@0.0.2` package root and generated declarations
- Local `socket-store/main` docs at `docs/guide/api.md`

## Public Core Dependencies

| Adapter dependency | Current adapter use | Public core mapping | Status |
| --- | --- | --- | --- |
| `SocketStore` | Re-exported from `react-socket-store` root and used by README examples. | Public `socket-store` root export in npm `0.0.2`; generic contract documented on local `socket-store/main`. | Public, but typed contract is stronger on local main than the current npm release. |
| `createMessageHandler` | Re-exported from `react-socket-store` root and used by README examples. | Public `socket-store` root export in npm `0.0.2`; schema-aware handler contract documented on local `socket-store/main`. | Public. |
| `send({ key, data })` | `useSend` and `useSocket` call `store.send({ key, data })`. | Public behavior on `SocketStore`; adapter-facing `SocketStoreSender` exists on local `socket-store/main`. | Public behavior; adapter should import the core adapter type after release ordering is settled. |
| `getState(key)` | `useListen` uses it as the `useSyncExternalStore` snapshot getter. | Public behavior on `SocketStore`; adapter-facing `SocketStoreStateGetter` exists on local `socket-store/main`. | Public behavior; unknown-key runtime behavior still needs adapter tests. |
| `subscribe(key, listener)` | `useListen` subscribes per topic and uses a returned function when present. | npm `0.0.2` declares `void`; local `socket-store/main` documents `Unsubscribe`. | Gap until the adapter depends on a core release with `Unsubscribe`. |
| Topic schema types | `react-socket-store` defines local `SocketSchema`, `TopicKey`, `TopicState`, and `TopicPayload`. | Local `socket-store/main` exports equivalent schema and adapter contract types. | Temporary duplication; align after cross-repository release planning. |
| `onConnect` and `onMessage` | Included in `SocketStoreLike`, but hooks do not call them directly. | Public methods on npm `0.0.2` `SocketStore`; local main treats lifecycle as core-owned. | Adapter surface can likely narrow to send/getState/subscribe once core adapter types are consumed. |

## Runtime Assumptions

- Unknown topic keys: React hooks currently assume `getState(key)` and
  `subscribe(key, listener)` are valid for the provided key. The npm `0.0.2`
  runtime throws by property access for unknown `getState` keys and allows
  subscriptions to unknown keys. Local `socket-store/main` documents runtime
  unknown-key reads as not guaranteed. Cover this in #30 before documenting a
  stronger adapter guarantee.
- Duplicate handler keys: The adapter does not inspect handler arrays. It
  assumes `socket-store` owns duplicate-key validation. Local
  `socket-store/main` documents duplicate handler keys as constructor errors.
- Send behavior: `useSend` sends the selected topic and payload without runtime
  validation. The type relationship is local to `react-socket-store` today.
  Local `socket-store/main` exports schema-aware send contracts, but the adapter
  should not rely on them until the package dependency is released.
- Subscribe cleanup: `useListen` supports both core shapes by treating a missing
  unsubscribe as a no-op cleanup. This preserves compatibility with npm
  `0.0.2`, but real cleanup depends on a core contract that returns
  `Unsubscribe`.
- Listener timing: `useListen` assumes `subscribe` notifies after state updates
  and `getState` returns the latest snapshot. Existing React tests use a fake
  store for this behavior; #30 should verify the same behavior against a real
  or faithful core store fixture.

## Gaps And Follow-Ups

- #29 should confirm there are no deep `socket-store/dist/*` dependencies and
  document any temporary internal dependency. Current source imports only the
  package root.
- #30 should add adapter contract tests for real core behavior: unknown keys,
  duplicate keys, send, subscribe notification, unsubscribe cleanup, and hook
  unmount cleanup.
- #31 should turn this map into user-facing responsibility and compatibility
  docs once the core release boundary is known.
- #32 should define release order so `react-socket-store` does not publish
  against core adapter types or unsubscribe behavior that are unavailable on
  npm.

## Working Rule

Until #32 resolves the cross-package release order, new adapter code should keep
using the local `SocketStoreLike` surface and public package-root imports only.
Do not import generated `socket-store/dist/*` paths or claim runtime behavior
that is not backed by either current tests or the local core contract docs.
