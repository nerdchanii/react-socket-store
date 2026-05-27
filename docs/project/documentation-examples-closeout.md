# Documentation And Runnable Examples Closeout

This note reconciles umbrella issue #10 against the stacked stabilization PRs.
It is maintainer-facing status, not a public package contract.

## Status

Issue #10 is ready to close after the stacked dependency PRs merge in order.
No additional runtime behavior is required in this closeout branch.

## Dependency Coverage

| Area | Covering PR | Status |
| --- | --- | --- |
| Runnable local WebSocket example | #77 | Ready |
| Canonical examples index and agent pointer | #78 | Ready |
| Provider guide | #79 | Ready |
| Store-direct hook guide | #72 | Ready |
| Next.js App Router client boundary guide | #71 | Ready |
| Compatibility table and migration notes | #80 | Ready |
| Core package responsibility split | #81 | Ready |

## Acceptance Reconciliation

- README and public guides use `SocketStore`, `createMessageHandler`,
  `SocketProvider`, `useSocket`, `useListen`, and `useSend` from current public
  package entrypoints.
- `docs/public/guide/` documents direct store construction as the current store
  creation path and marks `createSocketStore` as unavailable.
- `example/` includes a local WebSocket echo server and documented run commands.
- `docs/public/examples/` lists the canonical provider, store-direct, and
  Next.js examples with setup, message flow, cleanup, and copy-paste notes.
- `docs/public/compatibility/` and `docs/public/migration/` distinguish
  `react-socket-store` adapter ownership from `socket-store` core ownership.
- `docs:build` is part of the package verification set and CI expectations in
  `docs/project/check-failure-playbook.md`.

## Follow-Up

Issue #58 tracks public docs snippet verification. Treat that as the remaining
hardening work for executable README and `docs/public` examples, not as a
blocker for the #10 umbrella reconciliation.
