# Agent Guide

Use this page when an agent needs to choose a supported
`react-socket-store` integration shape. Start from the canonical package
context, then follow the public docs that match the code you are changing.

## Read First

- [`llms.txt`](https://github.com/nerdchanii/react-socket-store/blob/main/llms.txt)
  is the package entrypoint for agents.
- [`docs/agents/agent-context.json`](https://github.com/nerdchanii/react-socket-store/blob/main/docs/agents/agent-context.json)
  lists canonical docs, source entrypoints, examples, and non-goals in
  structured form.
- The [API guide](../api/) defines the supported provider and hook signatures.
- The [examples guide](../examples/) is the canonical examples index for
  provider, store-direct, and Next.js App Router shapes.
- The [`socket-store` API contract](https://nerdchanii.github.io/socket-store/api)
  owns framework-agnostic store behavior for `SocketStore`,
  `createMessageHandler`, protocol adapters, socket lifecycle callbacks, core
  errors, and message routing.

If these references disagree, prefer shipped source, tests, and public docs over
older planning notes.

## Choosing An Integration Shape

Use `SocketProvider` when a client-rendered SPA subtree should share one store
through React context. The provider does not create or close the `WebSocket`;
the owner that creates the socket owns cleanup.

Use store-direct hooks when a component already owns or receives a store. This
is the preferred shape for focused client islands, route data-loader patterns,
tests, embedded widgets, and code that should not widen a provider boundary.
Call `useSocket(store, topic)`, `useListen(store, topic)`, or
`useSend(store, topic)` with the explicit store.

Do not invent global, server-owned, or module-singleton WebSocket patterns. For
Next.js App Router, keep `WebSocket`, `SocketStore`, `SocketProvider`, and
hooks inside Client Components. Server Components may fetch request data and
pass only serializable snapshots into a client island.

## Source Checks

Before changing behavior or documenting a guarantee, inspect the relevant
source and tests:

- `src/components/SocketProvider.tsx` and `src/components/context.ts` for
  provider and context behavior.
- `src/components/hooks/` for hook overloads, snapshots, sends, and
  subscription cleanup.
- `src/types.ts`, `tests/`, and `test-d/` for runtime and type contracts.
- `example/` for runnable provider setup.

## Cross-Package Boundary

For core WebSocket topic-store behavior, use the
[`socket-store` public docs](https://nerdchanii.github.io/socket-store/) and
[`socket-store` API contract](https://nerdchanii.github.io/socket-store/api)
instead of adding new behavior to this adapter.

`socket-store` owns `SocketStore`, `createMessageHandler`, topic snapshots,
message routing, protocol adapters, lifecycle callbacks, socket send failures,
and core error semantics. `react-socket-store` owns only the React adapter
contract: provider wiring, hook overloads, render snapshots, subscription
cleanup from React effects, schema-safe hook usage, and Next.js Client Component
boundaries.

## MCP Docs-Query Evaluation

After the public API, docs, and examples stabilize, make a yes/no decision on
whether an MCP docs-query integration would help agents find the canonical
React adapter docs more reliably than `llms.txt` and the public docs index.

Evaluate MCP only as a documentation query surface over existing public docs and
agent metadata. Do not add runtime package functionality, WebSocket behavior,
A2A protocol support, or a second API surface as part of this evaluation.
