# Documentation Structure

This directory is the source of truth for future `react-socket-store`
documentation. Keep pages in the same structure the public docs site or package
docs will expose.

## Intended Layout

- `docs/guide/`: public user-facing guides, tutorials, API usage pages, React
  integration notes, and migration notes.
- `docs/examples/`: written walkthroughs for runnable or directly adaptable
  examples. Do not copy large source files from `example/`.
- `docs/agents/`: LLM-readable package context, indexes, and structured
  metadata.
- `docs/project/`: maintainer-facing planning notes that should not be treated
  as public package documentation.

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
