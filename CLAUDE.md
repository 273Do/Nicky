# Nicky - Journaling App

## Project Overview

Nicky is a React Native journaling app built with Expo and Expo Router. It features native iOS UI via `@expo/ui/swift-ui` (SwiftUI components), native tab navigation, and file-based routing.

## Development Commands

```bash
pnpm expo run:ios   # Build and run on iOS simulator
pnpm expo start     # Start Expo dev server
pnpm lint           # Run ESLint
pnpm lint-fix       # Run ESLint with auto-fix
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
  _layout.tsx                  # NativeTabs (root) — tab bar always visible
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

### Directory Structure

```
src/
  app/                   # Routes (Expo Router file-based)
  components/
    app-tabs.tsx         # NativeTabs definition
    journal/             # Journal-related components
      journal-view.tsx   # Grid list of journal cards
      journal-card.tsx   # Tappable gradient card
      journal-create-view.tsx
    entry/               # Entry-related components
      entry-list-view.tsx  # List grouped by month
      entry-row.tsx        # Date + title + preview row
  mocks/
    journals.ts          # JournalObj type + JOURNALS array
    entries.ts           # Entry type + ENTRIES array
  constants/
  hooks/
```

### Key Technologies

| Package | Usage |
|---|---|
| `expo-router` | File-based routing, `useRouter`, `useLocalSearchParams` |
| `@expo/ui/swift-ui` | SwiftUI components: `Host`, `ZStack`, `VStack`, `Grid`, `ScrollView`, `List`, `Section`, `Button`, `Image`, `Text`, `RoundedRectangle` |
| `@expo/ui/swift-ui/modifiers` | `frame`, `padding`, `font`, `foregroundStyle`, `onTapGesture`, `clipShape`, `lineLimit`, `headerProminence`, `listStyle` |
| `expo-router/unstable-native-tabs` | `NativeTabs` — iOS native tab bar |
| `expo-symbols` | `SymbolView` — SF Symbols in RN header components |
| `PlatformColor` | Adaptive system colors: `"label"`, `"systemBackground"`, `"systemIndigo"` |

### SwiftUI Component Rules

- Always wrap SwiftUI components in `<Host>` with `useViewportSizeMeasurement`
- Use `onTapGesture` modifier for taps — `onPress` prop does NOT work on layout components
- Gradients: `RoundedRectangle` + `foregroundStyle({ type: "linearGradient", ... })` + `clipShape` on parent `ZStack`
- Adaptive colors: use `PlatformColor("label")` directly — no need for `useColorScheme`
- Secondary text: `foregroundStyle({ type: "hierarchical", style: "secondary" })`
- `List` manages its own scrolling — never nest it inside `ScrollView`

### Naming Conventions

| Term | Meaning |
|---|---|
| Journal | A category/collection (shown as a card in the grid) |
| Entry | An individual record within a journal |

## Code Style

- **Import order:** external → internal (`@/`) → relative; always separated by newlines
- **Unused imports:** auto-enforced by ESLint (`eslint-plugin-unused-imports`)
- **Path alias:** `@/*` → `src/*`
- **TypeScript:** strict mode enabled
- **Formatter:** Prettier (enforced via ESLint)
- **React Compiler:** enabled (`reactCompiler: true` in app.json)
