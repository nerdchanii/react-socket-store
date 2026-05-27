# Migration

Use public package entrypoints when moving code onto the stabilized adapter:

- Import React helpers from `react-socket-store`.
- Import core store helpers from `socket-store`.
- Do not import from generated `socket-store/dist/*` paths.

Keep React adapter docs focused on provider setup, hook behavior, render timing,
subscription cleanup, and schema-safe hook usage. Link to `socket-store` for
core WebSocket topic-store behavior.
