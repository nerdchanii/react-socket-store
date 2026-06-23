---
title: Branch Policy
doc_type: policy
status: active
owner: maintainers
applies_to: react-socket-store
last_reviewed: 2026-05-29
source_of_truth: docs/project/branch-policy.md
---

# Branch Policy

`react-socket-store` uses trunk-based development. The goal is to keep `main`
close to releasable adapter behavior while allowing short-lived task branches
and, only when necessary, explicit maintenance branches.

## Branch Roles

- `main`: the default trunk branch. It should stay release-ready after every
  merge.
- `codex/*`, `feature/*`, `fix/*`, and `docs/*`: short-lived work branches for
  pull requests.
- `release/<major>.<minor>`: protected maintenance branches for patch releases
  on an existing minor line.
- `hotfix/*`: emergency fix branches for the currently affected release line.

Do not introduce a long-lived `dev` branch.

## Normal Development Flow

1. Branch from the latest `main`.
2. Keep the change scoped to one issue or pull request purpose.
3. Merge only after CI passes and the adapter still matches the intended public
   contract.
4. Delete short-lived branches after merge unless another open pull request is
   stacked on them.

## Maintenance And Backports

- Create `release/<major>.<minor>` only after a released minor line needs
  supported patch maintenance.
- Backport only critical bug fixes, security fixes, or release-blocking
  compatibility fixes.
- If the same fix also belongs on `main`, land or cherry-pick it there as well.

## Cleanup Rules

Automatic cleanup may delete merged, inactive short-lived branches in these
families:

- `codex/*`
- `feature/*`
- `fix/*`
- `docs/*`

Automatic cleanup must not delete:

- `main`
- `release/*`
- active `hotfix/*`
- branches used as the base for an open stacked pull request
