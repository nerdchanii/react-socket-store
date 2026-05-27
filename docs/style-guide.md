# Documentation Style Guide

Use this guide before adding generated pages, public guides, examples, or
agent-readable files.

## Writing Rules

- Document only behavior verified from source, tests, runnable examples, or an
  accepted issue contract.
- Prefer concrete React examples over placeholder prose.
- Keep headings stable and descriptive so agents can link to them directly.
- Use present tense for supported behavior and future tense only for explicitly
  deferred work.
- Mark non-goals clearly instead of implying broad React, server, or protocol
  support.
- Do not include marketing filler, empty placeholder pages, or undocumented
  behavior claims.

## Source Checks

Before documenting a guarantee, inspect the relevant source or tests:

- `src/components/SocketProvider.tsx` for provider props and context behavior.
- `src/components/context.ts` for hook context errors and store access.
- `src/components/hooks/` for `useSocket`, `useSend`, and `useListen`
  behavior.
- `src/types.ts` for exported React adapter types.
- `tests/` and `test-d/` for runtime and type expectations.
- `example/` for runnable React setup and cleanup behavior.

## Referencing socket-store

`react-socket-store` is the React adapter. It should reference `socket-store`
for core WebSocket topic-store behavior instead of restating the full core API.

- Link to the `socket-store` README or API contract for `SocketStore`,
  `createMessageHandler`, protocol adapters, socket lifecycle, and core errors.
- Keep React docs focused on provider setup, hook behavior, render timing,
  subscription cleanup, and schema-safe hook typing.
- Do not claim ownership of core protocol parsing, reconnect behavior,
  persistence, or server behavior.
- Import examples and type references from public `socket-store` package
  entrypoints, not generated `socket-store/dist/*` paths.

## Examples

Examples must be runnable or directly adaptable from runnable files. Include the
verification command when practical, such as `npm run lint`, `npm run test`, or
`npm run type-test`.

Examples should identify:

- Required provider setup.
- Expected hook inputs and outputs.
- Subscription or component cleanup behavior.
- Which behavior comes from `react-socket-store` versus `socket-store`.

## Agent-Readable Docs

Agent docs should help coding tools identify package purpose, entry points,
React boundaries, examples, non-goals, and canonical public docs without
re-reading every source file.

Do not describe future docs tooling, protocol adapters, or runtime integrations
as available unless a shipped source file or accepted issue explicitly scopes
that support.
