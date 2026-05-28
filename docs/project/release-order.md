# Cross-Repository Release Order

This note defines the release order for stabilization work that spans
`socket-store` and `react-socket-store`. It does not define npm publish
automation, provenance, protected environments, or GitHub Release mechanics;
those remain blocked on `socket-store` #57.

## Required Order

1. Merge and release the required `socket-store` public contract first.
2. Verify the `socket-store` package is available from npm at the version the
   adapter will consume.
3. Update `react-socket-store` to depend on that public `socket-store` version
   and consume only package-root exports.
4. Run the adapter checks from `docs/project/check-failure-playbook.md`,
   including docs build and package dry run.
5. Release `react-socket-store` only after the public docs name the required
   `socket-store` version and migration notes.

Adapter-only docs, examples, hook tests, and React cleanup fixes may release
without a new `socket-store` release when they do not require new core behavior,
new core types, or a different package dependency range.

## Migration Note Requirements

Before any adapter release that raises the required `socket-store` contract,
public migration notes must include:

- the minimum compatible `socket-store` version
- whether the adapter dependency range changed
- any import changes, especially package-root imports replacing generated
  `socket-store/dist/*` paths
- any hook, provider, subscription cleanup, or schema typing changes visible to
  React consumers
- any removed or deferred behavior that should not be treated as supported

If no consumer migration is required, say that explicitly in
`docs/public/migration/` and keep the compatibility table current.

## Compatibility And Rollback

The main compatibility risk is publishing `react-socket-store` against core
behavior or public core types that are not yet available from npm. Roll back by
restoring the previous adapter dependency range and examples, then release a
patch after the package contents and docs build pass.

If a bad core release is published, do not publish a dependent adapter release
until the core package has a corrected npm version. If an adapter release is
already published against a bad core version, follow the guarded release and
deprecation policy once `socket-store` #57 defines it.
