# Agent Docs And MCP Evaluation Closeout

This note reconciles umbrella issue #13 against the stacked stabilization PRs.
It is maintainer-facing status, not a public package contract.

## Status

Issue #13 is ready to close after the stacked dependency PRs merge in order.
No runtime behavior, package export, or npm release is required for this
closeout branch.

## Dependency Coverage

| Area | Covering PR | Status |
| --- | --- | --- |
| Public agent entrypoint | #86 | Ready |
| Structured agent context metadata | #87 | Ready |
| Public agent guide | #88 | Ready |
| socket-store public contract cross-links | #89 | Ready |
| MCP docs-query evaluation decision | #90 | Ready |

## Acceptance Reconciliation

- Agents can identify `SocketProvider` as the SPA convenience path from
  `llms.txt`, `docs/public/agents/`, `docs/public/guide/`, and
  `docs/agents/agent-context.json`.
- Agents can identify store-direct hooks as the recommended path for focused
  client islands, data-loader flows, Next.js App Router code, and components
  that already own or receive a store.
- Next.js guidance keeps `WebSocket`, `SocketStore`, `SocketProvider`, and
  hook usage inside Client Components and limits Server Component handoff to
  serializable snapshots.
- Agent-facing entrypoints link to canonical docs, examples, tests, source
  files, and `socket-store` public contract docs instead of duplicating detailed
  API contracts.
- The MCP decision is documented as a deferred yes/no docs-query evaluation over
  existing public docs and metadata, not as runtime package functionality.
- Agent-facing docs explicitly exclude A2A protocol support from this package
  scope.

## Follow-Up

Issue #59 remains blocked on an owner-confirmed public docs URL/path. Treat that
as separate public docs hosting work, not as a blocker for the #13 umbrella
reconciliation.
