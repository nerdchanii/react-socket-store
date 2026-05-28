# AGENTS.md

This repository is the React adapter for `socket-store`. Keep changes focused on
React provider, hook, type, documentation, and package-boundary work.

## Read First

- Documentation structure: `docs/README.md`
- Documentation wording and source checks: `docs/style-guide.md`
- Check failures and CI expectations: `docs/project/check-failure-playbook.md`
- Public package overview: `README.md`
- Provider and context behavior: `src/components/SocketProvider.tsx` and
  `src/components/context.ts`
- Hook behavior: `src/components/hooks/`
- Public React adapter types: `src/types.ts` and `test-d/`
- Runtime behavior: `tests/`
- Runnable React setup: `example/`

## Documentation Scope

- Current public docs live at
  `https://nerdchanii.github.io/react-socket-store/`; source lives in
  `README.md` and `docs/public/`.
- `docs/README.md` describes the documentation layout.
- Agent-readable package context belongs in `docs/agents/` when the issue scope
  calls for that content.
- Maintainer planning and failure guidance live in `docs/project/`; do not treat
  these notes as public package guarantees.
- Before changing public docs or examples, read `docs/README.md`,
  `docs/style-guide.md`, and any referenced source or tests.
- Do not document behavior as available unless source, tests, or runnable
  examples prove it.

## Source Boundaries

- For API, hook, or type work, inspect the provider, context, hooks, exported
  types, runtime tests, and type tests before editing.
- For Next.js, React Server Components, or client-boundary work, verify the
  current source and examples first. Mark unsupported or deferred behavior
  clearly instead of implying broad React runtime support.
- Reference `socket-store` for core WebSocket topic-store behavior. Keep this
  package focused on React integration, render timing, subscription cleanup, and
  schema-safe hook usage.
- Import from public package entrypoints. Do not use generated
  `socket-store/dist/*` paths.

## Verification

Use existing package scripts as executable conventions:

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run docs:build`
- `npm run pack:dry-run`
- `npm run prepack`

There is no automated example build script yet. If one is added, route failures
through `docs/project/check-failure-playbook.md` and keep fixes tied to
source-backed documentation or runnable examples.

Do not publish npm releases, rename packages, or move this package into a
monorepo unless explicitly requested.
