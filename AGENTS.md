# AGENTS.md

## Cursor Cloud specific instructions

This is a **pnpm monorepo** for a VitePress-based blog ecosystem. There are no automated tests (no vitest/jest). There are no databases or external services required for local development.

### Services

| Service | Command | Default Port |
|---|---|---|
| Blog dev server (blogpress) | `pnpm dev` | 5173 |
| Theme docs dev server | `pnpm dev:theme` | 5174 (or next available) |

### Key commands

- **Install deps**: `pnpm install`
- **Build libraries** (required before running dev servers): `pnpm buildlib`
- **Lint**: `pnpm lint` (pre-existing lint errors exist in the repo; this is expected)
- **Blog build**: `pnpm build`
- **Theme docs build**: `pnpm buildTheme`

See `package.json` root scripts and the repo README for the full command list.

### Gotchas

- `pnpm buildlib` may fail on a clean install due to a race condition: the `build:rss` and `build:pagefind` tasks use `wait-on packages/shared/dist` to wait for the shared package, but `.d.ts` generation may not be complete when the directory appears. If `buildlib` fails, simply re-run it and it will succeed on the second attempt since `packages/shared/dist` will already be fully populated.
- pnpm 10+ blocks lifecycle scripts by default. The `pnpm.onlyBuiltDependencies` allowlist in `package.json` controls which packages may run install scripts. If new native dependencies are added and their postinstall scripts are blocked, they may need to be added to that allowlist.
- The `postinstall` script runs `npx simple-git-hooks` to set up a `pre-commit` hook that runs `pnpm lint-staged` (which applies `eslint --fix`).
