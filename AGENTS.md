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

- `build:rss` and `build:pagefind` wait for `packages/shared/dist/index.d.ts` (not just the `dist/` directory) so parallel `buildlib` tasks do not start before shared type declarations are ready.
- pnpm 10+ blocks lifecycle scripts by default. The `pnpm.onlyBuiltDependencies` allowlist in `package.json` controls which packages may run install scripts. If new native dependencies are added and their postinstall scripts are blocked, they may need to be added to that allowlist.
- The `postinstall` script runs `npx simple-git-hooks` to set up a `pre-commit` hook that runs `pnpm lint-staged` (which applies `eslint --fix`).

### Release changelog checklist

When updating versions or changelogs, compare the current package version with the previous git tag for that package and keep these files in sync as applicable:

- Package changelogs: `packages/*/CHANGELOG.md`
- Theme public changelog page: `packages/theme/docs/changelog.md`
- Blog package changelog when `blogpress` consumes a new theme/plugin version: `packages/blogpress/CHANGELOG.md`
- Create-theme changelog and template dependency when the starter template consumes a new theme version: `packages/create-theme/CHANGELOG.md` and `packages/create-theme/public/template/package.json`
- Package manifests and lockfile for version/dependency bumps: package-level `package.json` files and `pnpm-lock.yaml`
