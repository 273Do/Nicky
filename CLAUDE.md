# CLAUDE.md

Nicky is a React Native journaling app built with Expo and Expo Router. It features native iOS UI via `@expo/ui/swift-ui` (SwiftUI components), native tab navigation, SQLite persistence via Drizzle ORM, and per-journal Face ID / Touch ID lock.

## Commands

```bash
pnpm expo run:ios          # Build and run on iOS simulator
pnpm expo start --clear    # Start Expo dev server (clear cache)
pnpm lint                  # Run ESLint
pnpm lint-fix              # Run ESLint with auto-fix
pnpm typecheck             # TypeScript type check
pnpm drizzle-kit generate  # Generate migration files from schema
```

## Commit Convention

Enforced by vite-hooks + commitlint (pre-commit: lint, commit-msg: format):

```
feat: add new feature
fix: bug fix
refactor: refactoring
chore: tooling / config changes
```

## Guides

Read the relevant guide before working in that area:

| When                                     | Read                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| Routing, navigation, tech stack          | [docs/guides/architecture.md](docs/guides/architecture.md)   |
| Schema, migrations, Drizzle, LiveQuery   | [docs/guides/database.md](docs/guides/database.md)           |
| SwiftUI components, Host, List, layout   | [docs/guides/swiftui-rules.md](docs/guides/swiftui-rules.md) |
| Form patterns, serialization, settings   | [docs/guides/patterns.md](docs/guides/patterns.md)           |
| AI reflection, export/import, local auth | [docs/guides/features.md](docs/guides/features.md)           |
| Subscriptions, RevenueCat, paywall       | [docs/guides/purchases.md](docs/guides/purchases.md)         |
| Imports, TypeScript, formatting, i18n    | [docs/guides/code-style.md](docs/guides/code-style.md)       |

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
