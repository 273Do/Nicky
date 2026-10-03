# Architecture

## Routing Structure

```
src/app/
  _layout.tsx                  # Root — wraps everything in DrizzleProvider + NativeTabs
  (journal)/
    _layout.tsx                # Stack — scoped to journal tab
    index.tsx                  # Journal screen (chip selector + entry list)
    create.tsx                 # Create journal  /create
    edit.tsx                   # Edit journal  /edit?journalId=...
    onboarding.tsx             # Onboarding flow
    entry/
      create.tsx               # Create entry  /entry/create?journalId=...&journalName=...
      [id].tsx                 # Entry detail  /entry/[id]?journalName=...
  days/
    _layout.tsx                # Stack — scoped to days tab
    index.tsx                  # Daily reflection list
    settings.tsx               # App settings (AI reflection, export, data management)
  search/
    _layout.tsx                # Stack — scoped to search tab
    index.tsx                  # Journal entry search
```

**Navigation flow:** Journal screen (chip select) → tap entry → `entry/[id]` (entry detail)

**Key rule:** `NativeTabs` is the root navigator; `Stack` lives inside each tab group (`(journal)`, `days`, `search`). This keeps the tab bar visible when pushing screens.

## Naming Conventions

| Term    | Meaning                                               |
| ------- | ----------------------------------------------------- |
| Journal | A category/collection (selected via chip in the list) |
| Entry   | An individual record within a journal                 |

## Key Technologies

| Package                                    | Usage                                                                                                                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expo-router`                              | File-based routing, `useRouter`, `useLocalSearchParams`                                                                                                                                                 |
| `@expo/ui/swift-ui`                        | SwiftUI components: `Host`, `ZStack`, `VStack`, `HStack`, `Spacer`, `Grid`, `ScrollView`, `List`, `Section`, `Button`, `Image`, `Text`, `RoundedRectangle`, `ColorPicker`, `BottomSheet`, `ContextMenu` |
| `@expo/ui/swift-ui/modifiers`              | `frame`, `padding`, `foregroundStyle`, `onTapGesture`, `listStyle`, `presentationDetents`, `environment`, `fixedSize`, `font`, `lineLimit`                                                              |
| `expo-router/unstable-native-tabs`         | `NativeTabs` — iOS native tab bar                                                                                                                                                                       |
| `expo-symbols`                             | `SymbolView` — SF Symbols in RN (non-SwiftUI) header components                                                                                                                                         |
| `expo-sqlite` + `drizzle-orm`              | Local SQLite persistence                                                                                                                                                                                |
| `expo-crypto`                              | `Crypto.randomUUID()` for ID generation at the app layer                                                                                                                                                |
| `PlatformColor`                            | Adaptive system colors: `"label"`, `"systemBackground"`, `"systemIndigo"`                                                                                                                               |
| `@react-native-ai/llama`                   | On-device GGUF model download + inference via `downloadModel()` and `llama.languageModel()`                                                                                                             |
| `ai` (Vercel AI SDK)                       | `generateText()` with structured prompts — used with llama model provider                                                                                                                               |
| `@expensify/react-native-live-markdown`    | Live Markdown editor — import from `src/MarkdownTextInput` to avoid `parseExpensiMark` auto-loading `html-entities`. Custom `parser` must be a worklet.                                                 |
| `@ronradtke/react-native-markdown-display` | Full Markdown rendering (headers, lists, code blocks) for longText view mode                                                                                                                            |
| `expo-maps`                                | Apple Maps via `AppleMaps.View` — used for location field display                                                                                                                                       |
| `expo-image-picker`                        | Media field — pick images/videos from camera roll                                                                                                                                                       |
| `expo-local-authentication`                | Face ID / Touch ID — per-journal lock via `authenticateAsync()`                                                                                                                                         |
| `jszip`                                    | Zip file generation for bulk export (`Uint8Array` output)                                                                                                                                               |
| `react-native-purchases`                   | RevenueCat SDK — subscriptions, `nicky_pro` entitlement, offerings. Paywall UI is hand-built (see `purchases.md`)                                                                                       |
