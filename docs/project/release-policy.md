---
title: Release Policy
doc_type: policy
status: active
owner: maintainers
applies_to: react-socket-store
last_reviewed: 2026-05-29
source_of_truth: docs/project/release-policy.md
---

# Release Policy

## Purpose

Define when `react-socket-store` changes are release-relevant and which adapter
release rules maintainers follow.

## Rules

### Stable Branch

- `main` is the default release branch.
- Every merge to `main` should keep the adapter releasable.
- Do not create long-lived integration branches such as `dev`.

### Release-Relevant Changes

Treat these as release-relevant:

- runtime or type changes under `src/`
- packaging or export changes in `package.json`
- public docs changes that alter supported adapter usage or guarantees
- runnable example changes that alter supported setup or behavior
- dependency-range changes for `socket-store`

Maintainer-only notes under `docs/project/` are not release-relevant by
themselves.

### Versioning

- Use semver.
- Prefer `patch` for compatible bug fixes, packaging fixes, and docs-contract
  corrections.
- Prefer `minor` for additive adapter API, new supported React flows, or new
  documented integration paths.
- Use `major` for breaking hook, provider, packaging, or migration-contract
  changes.

### Cross-Repository Order

- If a release depends on a new `socket-store` public contract, release
  `socket-store` first.
- Do not publish the adapter until the required `socket-store` version is
  available on npm.
- Public migration notes must state the minimum compatible `socket-store`
  version whenever the adapter dependency floor changes.

### Maintenance Branches

- Create `release/<major>.<minor>` only after a shipped minor line needs
  supported patch maintenance.
- Backport only critical bug fixes, security fixes, or release-blocking
  compatibility fixes.

### Prereleases

- Publish stable releases from `main` by default.
- Use prerelease tags only when maintainers intentionally need external testing
  of unreleased adapter behavior.

## Review Questions

- Does the change alter what adapter consumers can rely on?
- Does the change depend on a `socket-store` version that is not yet published?
- Does the change require migration or compatibility notes?
