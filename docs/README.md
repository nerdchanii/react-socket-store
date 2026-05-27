# Documentation Structure

This directory is the source of truth for future `react-socket-store`
documentation. Keep pages in the same structure the public docs site or package
docs will expose.

## Intended Layout

- `docs/public/`: VitePress source for public user-facing guides, API usage
  pages, examples, migration notes, and React integration notes.
- `docs/agents/`: LLM-readable package context, indexes, and structured
  metadata.
- `docs/project/`: maintainer-facing planning notes that should not be treated
  as public package documentation. Start with
  `docs/project/socket-store-contract-map.md` for cross-package contract work.

Root files keep their existing roles: `README.md` is the concise package
overview, `example/` contains runnable app code, and `src/` is the source of
truth for exported React behavior.

## Public Docs Versus Project Docs

Public docs explain the supported React adapter contract: provider setup, hook
behavior, schema-safe topic usage, subscription cleanup, React rendering
expectations, examples, and non-goals.

Project docs may track verification playbooks, release decisions, and planning
context. Do not present project notes as package guarantees.

Agent-facing docs should point to public docs, source files, examples, and
metadata without duplicating complete API references.
