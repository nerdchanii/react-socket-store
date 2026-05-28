# Documentation Structure

This directory is the source of truth for the `react-socket-store`
documentation site published at
<https://nerdchanii.github.io/react-socket-store/>. Keep pages in the same
structure the public docs site exposes.

## Intended Layout

- `docs/public/`: VitePress source for public user-facing guides, API usage
  pages, examples, migration notes, and React integration notes.
- `docs/agents/`: LLM-readable package context, indexes, and structured
  metadata.
- `docs/project/`: maintainer-facing planning notes that should not be treated
  as public package documentation. Start with
  [`docs/project/README.md`](./project/README.md) for the internal-docs index,
  then use `docs/project/socket-store-contract-map.md` for cross-package
  contract work, `docs/project/store-creation-path.md` for the official store
  creation decision, and `docs/project/release-order.md` for cross-repository
  release order.

Root files keep their existing roles: `README.md` is the concise package
overview, `example/` contains runnable app code, and `src/` is the source of
truth for exported React behavior.

## Documentation Scripts

Use the package scripts from a clean checkout after `npm install`:

- `npm run docs:build` builds the VitePress public docs in `docs/public/`.
- `npm run docs:preview` serves the built docs for manual review.
- `npm run docs:snippets` extracts TypeScript and TSX fences from `README.md`
  and `docs/public/`, then compiles them against the current package exports.

## Public Docs Versus Project Docs

Public docs explain the supported React adapter contract: provider setup, hook
behavior, schema-safe topic usage, subscription cleanup, React rendering
expectations, examples, and non-goals.

Project docs may track verification playbooks, release decisions, and planning
context. Do not present project notes as package guarantees.

Agent-facing docs should point to public docs, source files, examples, and
metadata without duplicating complete API references.

## Deployment

GitHub Pages deploys the VitePress output from `docs/public/` to the
`/react-socket-store/` project-site base path. The deploy workflow builds with
`npm run docs:build`, uploads only `docs/public/.vitepress/dist`, and publishes
that artifact to <https://nerdchanii.github.io/react-socket-store/>.

Maintainer notes in `docs/project/` and local planning notes are outside the
VitePress source tree and are not deployed. If Pages is not enabled for the
repository yet, an owner must configure Pages to use GitHub Actions as the
source before the workflow can publish.

Use [`docs/project/README.md`](./project/README.md) as the entry point for
internal repository notes. If an accepted process or architecture rule needs a
single long-lived source of truth, record that need there and promote the rule
into a dedicated SPEC instead of repeating it across closeout notes.

To roll back a bad docs deployment, revert the commit that changed the public
docs or workflow and let the `Pages` workflow deploy the reverted artifact. If
the workflow itself is failing, disable Pages publication in repository settings
or temporarily disable the `Pages` workflow, then re-enable it after the fix
lands.

## Verified Snippets

Public TypeScript and TSX snippets are checked in two layers:

- `test-d/*.test-d.tsx` keeps curated mirrors for README, hook, and example
  contracts that need type assertions or expected errors.
- `npm run docs:snippets` extracts every public `ts`, `tsx`, and `typescript`
  code fence from `README.md` and `docs/public/` so CI fails when docs reference
  missing exports, invalid hook signatures, or unsupported package imports.
