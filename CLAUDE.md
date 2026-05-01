# Nicky - Journal Management App

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

Enforced by lefthook (pre-commit: lint check, commit-msg: format check):

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
├── _layout.tsx              # Root layout — NativeTabs (tab bar stays visible on push)
├── explore.tsx              # Report tab screen
└── (journal)/
    ├── _layout.tsx          # Stack layout — must be inside NativeTabs to keep tab bar
    ├── index.tsx            # Template list screen
    ├── template-create.tsx  # Create template screen
    └── [id]/
        └── index.tsx        # Journal detail screen (receives id via useLocalSearchParams)
```

**Key rule:** `NativeTabs` is the root navigator; `Stack` lives inside a tab group. This keeps the tab bar visible when pushing screens.

### Key Technologies

| Package | Usage |
|---|---|
| `expo-router` | File-based routing, `useRouter`, `useLocalSearchParams` |
| `@expo/ui/swift-ui` | SwiftUI components: `Host`, `ZStack`, `VStack`, `Grid`, `ScrollView`, `Button`, `Image`, `Text`, `RoundedRectangle`, `BottomSheet` |
| `@expo/ui/swift-ui/modifiers` | Styling: `frame`, `padding`, `font`, `foregroundStyle`, `onTapGesture`, `clipShape`, `buttonStyle`, `labelStyle` |
| `expo-router/unstable-native-tabs` | `NativeTabs` — iOS native tab bar |
| `expo-symbols` | `SymbolView` — SF Symbols in RN components |
| `PlatformColor` | Adaptive system colors: `"label"`, `"systemBackground"`, `"systemIndigo"` |

### SwiftUI Component Rules

- Always wrap SwiftUI components in `<Host>` with `useViewportSizeMeasurement`
- Use `onTapGesture` modifier for taps — `onPress` prop does NOT work on layout components
- Gradients: use `RoundedRectangle` + `foregroundStyle({ type: "linearGradient", ... })` + `clipShape` on parent
- Adaptive text color in native headers: use `PlatformColor("label")` directly — no need for `useColorScheme`

### Naming Conventions

| Term | Meaning |
|---|---|
| Template | A journal category/folder (the type) |
| Journal | A record created from a template |
| Entry | An individual entry within a journal |

## Directory Structure

```
src/
├── app/          # Routes (Expo Router file-based)
├── components/
│   ├── journal/  # Journal-related components
│   ├── template/ # Template-related components
│   └── screens/  # Full-screen view components
└── mocks/        # Mock data with type definitions
    └── journals.ts  # JournalObj type + JOURNALS array
```

## Code Style

- **Import order:** external → internal (`@/`) → relative; always separated by newlines
- **Unused imports:** auto-enforced by ESLint (`eslint-plugin-unused-imports`)
- **Path alias:** `@/*` → `src/*`
- **TypeScript:** strict mode enabled
- **Formatter:** Prettier (enforced via ESLint)
- **React Compiler:** enabled (`reactCompiler: true` in app.json)
