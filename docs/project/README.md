# Project Docs

`docs/project/` is for maintainer-facing notes that explain repository
decisions, verification workflow, and historical closeout context. These files
are not part of the public package contract.

## File Guide

- `socket-store-contract-map.md`: cross-package contract inventory for adapter
  work that depends on `socket-store`.
- `store-creation-path.md`: the accepted store creation path for public docs
  and examples.
- `release-order.md`: cross-repository release-order guidance for maintainers.
- `check-failure-playbook.md`: how to triage local or CI failures without
  weakening checks.
- `documentation-examples-closeout.md`: historical closeout note for the #10
  documentation and runnable examples umbrella.
- `agent-docs-mcp-closeout.md`: historical closeout note for the #13 agent
  docs and MCP evaluation umbrella.

## Keep, Update, Or Retire

- Keep durable maintainer references such as contract maps, store creation
  decisions, release order, and failure playbooks.
- Keep closeout notes only as historical reconciliation records. They should
  say which umbrella issue they close and should not be treated as ongoing
  policy documents.
- Move user-facing guidance back to `docs/public/`.
- Move agent-oriented package context back to `docs/agents/`.

## When A SPEC Would Be The Right SSOT

This folder intentionally avoids introducing a full SPEC or ADR system. If the
repository later accepts long-lived process or architecture rules that multiple
project notes must follow, those accepted rules should move into a dedicated
SPEC and these notes should link to it instead of restating them.

The clearest current SPEC candidates are:

- cross-repository release-order policy
- accepted package-boundary rules between `react-socket-store` and
  `socket-store`
- accepted store-creation and adapter-integration conventions once they stop
  evolving as issue-by-issue docs work
