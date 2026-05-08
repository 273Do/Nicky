# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nicky is a React Native journaling app built with Expo and Expo Router. It features native iOS UI via `@expo/ui/swift-ui` (SwiftUI components), native tab navigation, and SQLite persistence via Drizzle ORM.

## Development Commands

```bash
pnpm expo run:ios        # Build and run on iOS simulator
pnpm expo start --clear  # Start Expo dev server (clear cache)
pnpm lint                # Run ESLint
pnpm lint-fix            # Run ESLint with auto-fix
pnpm typecheck           # TypeScript type check
pnpm drizzle-kit generate  # Generate migration files from schema
```

## Commit Convention

Enforced by lefthook (pre-commit: lint, commit-msg: format):

```
feat: add new feature
fix: bug fix
refactor: refactoring
chore: tooling / config changes
```

## Architecture

### Routing Structure

```
src/app/
  _layout.tsx                  # Root — wraps everything in DrizzleProvider + NativeTabs
  (journal)/
    _layout.tsx                # Stack — scoped to journal tab
    index.tsx                  # Journal list  /
    create.tsx                 # Create journal  /create
    [id].tsx                   # Entry list  /[id]
    entry/
      [id].tsx                 # Entry detail  /entry/[id]
  explore.tsx                  # Report tab
```

**Navigation flow:** Journal list → `[id]` (entry list) → `entry/[id]` (entry detail)

**Key rule:** `NativeTabs` is the root navigator; `Stack` lives inside `(journal)` group. This keeps the tab bar visible when pushing screens.

### Database Layer

Drizzle ORM + expo-sqlite. Schema is split by domain in `src/db/schemas/`:

| File | Tables |
|---|---|
| `journals.ts` | `journals` |
| `fields.ts` | `fields` (field definitions per journal) |
| `entries.ts` | `entries`, `entry_values` |

`src/db/schemas/index.ts` re-exports all schemas. `src/components/drizzle-provider.tsx` opens the DB, runs migrations via `useMigrations`, and exports `db`.

**Adding a schema change:** edit the relevant schema file → `pnpm drizzle-kit generate` → commit the generated files in `drizzle/`.

**Drizzle config notes:**
- Schema files must not import React Native packages (`expo-crypto`, `expo-symbols` runtime imports) — drizzle-kit runs in Node.js. Use `import type` for RN types.
- `$defaultFn` with `Crypto.randomUUID()` cannot be used in schema — generate IDs at the application layer instead.

### Key Technologies

| Package | Usage |
|---|---|
| `expo-router` | File-based routing, `useRouter`, `useLocalSearchParams` |
| `@expo/ui/swift-ui` | SwiftUI components: `Host`, `ZStack`, `VStack`, `Grid`, `ScrollView`, `List`, `Section`, `Button`, `Image`, `Text`, `RoundedRectangle`, `ColorPicker`, `BottomSheet` |
| `@expo/ui/swift-ui/modifiers` | `frame`, `padding`, `foregroundStyle`, `onTapGesture`, `listStyle`, `presentationDetents`, `environment`, `fixedSize` |
| `expo-router/unstable-native-tabs` | `NativeTabs` — iOS native tab bar |
| `expo-symbols` | `SymbolView` — SF Symbols in RN (non-SwiftUI) header components |
| `expo-sqlite` + `drizzle-orm` | Local SQLite persistence |
| `expo-crypto` | `Crypto.randomUUID()` for ID generation at the app layer |
| `PlatformColor` | Adaptive system colors: `"label"`, `"systemBackground"`, `"systemIndigo"` |

### SwiftUI Component Rules

- Always wrap SwiftUI components in `<Host>` with `useViewportSizeMeasurement`
- Use `onTapGesture` modifier for taps — `onPress` prop does NOT work on layout components
- `Button` inside `List` gets a blue tint by default — use `foregroundStyle({ type: "hierarchical", style: "primary" })` to keep the tap highlight without the blue color
- `List` manages its own scrolling — never nest it inside `ScrollView`
- Adaptive colors: use `PlatformColor("label")` directly — no need for `useColorScheme`
- `fixedSize()` on a component prevents it from stretching in an HStack, allowing siblings to fill remaining space
- Gradients: `RoundedRectangle` + `foregroundStyle({ type: "linearGradient", ... })` + `clipShape` on parent `ZStack`

### Naming Conventions

| Term | Meaning |
|---|---|
| Journal | A category/collection (shown as a card in the grid) |
| Entry | An individual record within a journal |

## Code Style

- **Import order:** external → internal (`@/`) → relative; always separated by newlines
- **Path alias:** `@/*` → `src/*`
- **TypeScript:** strict mode enabled
- **Formatter:** Prettier (enforced via ESLint)
- **React Compiler:** enabled — do not manually add `useMemo`/`useCallback` unless there is a specific reason
