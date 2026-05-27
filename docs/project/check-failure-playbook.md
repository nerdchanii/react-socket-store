# Check Failure Playbook

Use this playbook when a local check or CI job fails. Prefer fixing the root
cause over weakening a rule, skipping a test, or narrowing CI coverage.

## Current Checks

- `npm run lint`: runs public import checks, ESLint conventions, production
  typecheck, and type-level tests.
- `npm run lint:imports`: rejects imports from generated `socket-store/dist/*`
  paths.
- `npm run lint:eslint`: enforces TypeScript import conventions, unused
  variable checks, and React Hooks rules for `src/` and runtime tests.
- `npm run typecheck`: compiles package source with `tsc --noEmit`.
- `npm run type-test`: compiles `test-d/` type assertions.
- `npm test`: runs runtime hook tests with Vitest.
- `npm run build`: emits ESM and CJS package output into `lib/`.
- `npm run pack:dry-run`: validates package contents without publishing.
- `npm run prepack`: runs lint, tests, and build before packaging.

CI runs `npm run lint`, `npm test`, `npm run build`, and
`npm run pack:dry-run` against React 18 and React 19.

## Failure Response

Start with the first failing command. Rerun it locally, copy the exact command,
and fix the failing contract at its source.

- For `lint:imports`, replace deep `socket-store/dist/*` imports with public
  package-root imports.
- For `lint:eslint`, fix the TypeScript or React Hooks issue. Keep hook
  dependency arrays accurate; do not silence `react-hooks/exhaustive-deps`
  unless the code is restructured and the reason is documented in code.
- For `typecheck`, fix source types, exported types, or React component
  signatures. Do not loosen strict compiler settings to pass one call site.
- For `type-test`, update `test-d/` only when the public type contract changed
  intentionally. Otherwise fix the exported type.
- For `npm test`, fix implementation or test setup according to the failing
  runtime behavior. Do not delete assertions to preserve existing behavior.
- For `npm run build`, fix source, TypeScript config, or package output paths.
  Build failures should not be bypassed with manual `lib/` edits.
- For `pack:dry-run`, fix `package.json` metadata, `files`, or generated
  package output so consumers receive the intended files.

## Docs Build Failures

There is no `docs:build` script yet. If a future docs site adds one, keep docs
build failures tied to source-backed documentation:

- Fix broken links by pointing to canonical docs, source files, or runnable
  examples.
- Remove placeholder pages instead of making empty pages pass.
- Correct unsupported behavior claims using `docs/style-guide.md`.
- Keep public docs distinct from `docs/project/` maintainer notes.

## Example Failures

The runnable app currently lives in `example/`, but package CI does not yet run
an example build or dev server.

When an example check is added or an example fails manually:

- Fix provider setup, hook usage, or socket-store integration in `example/`.
- Keep examples directly adaptable from source; do not duplicate large example
  files into docs.
- Identify whether the failure belongs to `react-socket-store` hook/provider
  behavior or core `socket-store` WebSocket behavior.
- If the failure exposes missing automated coverage, add a package check or
  test instead of relying only on manual instructions.

## Unrelated Failures

If a failure is unrelated to the current change, do not hide it. Report:

- The command that failed.
- The relevant error summary.
- Why it is unrelated to the current diff.
- Whether the PR is blocked until it is fixed.

If the unrelated failure blocks CI for the PR, stop and fix it only when the fix
is within the issue scope or explicitly approved.
