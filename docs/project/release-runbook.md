---
title: Release Runbook
doc_type: runbook
status: active
owner: maintainers
applies_to: react-socket-store
last_reviewed: 2026-05-29
source_of_truth: docs/project/release-runbook.md
---

# Release Runbook

## Purpose

Describe the required steps for cutting and publishing a `react-socket-store`
release.

## Preconditions

- The release target is `main` or an approved `release/<major>.<minor>` branch.
- If the adapter depends on a new `socket-store` contract, that `socket-store`
  version is already published on npm.
- The package version and migration notes match the intended release.

## Release Flow

1. Confirm the target branch is clean and ready to release.
2. Verify any required `socket-store` dependency update is already merged and
   published.
3. Run the manual `Publish` workflow from the branch being released.
4. Approve the `npm-publish` environment when prompted.
5. Confirm npm, the git tag, and the GitHub Release all show the same version.

## Required Checks

Before publish, the branch must pass:

- `npm ci`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run docs:build`
- `npm run pack:dry-run`

## If A Check Fails

- Fix the root cause before continuing.
- Rerun the narrow failing command locally first, then the broader release set
  as needed.
- Do not weaken checks, skip tests, or rely on local generated output to push a
  release through.

## Publish Notes

- Publish runs through GitHub Actions, not ad hoc local commands.
- The workflow publishes to npm only when the current package version is not
  already published.
- The workflow creates the `v<version>` tag and matching GitHub Release if they
  do not already exist.
