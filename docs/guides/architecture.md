# Architecture

## Routing Structure

```
src/app/
  _layout.tsx                  # Root — wraps everything in DrizzleProvider + NativeTabs
  (journal)/
    _layout.tsx                # Stack — scoped to journal tab
    index.tsx                  # Journal screen (chip selector + entry list)
    days.tsx                   # Days screen (swipeable per-day timeline), toggled from the journal header
    settings.tsx               # App settings — renders SettingsView (src/components/settings/settings-view.tsx)
    paywall.tsx                # Nicky Pro paywall (modal)
    onboarding.tsx             # Onboarding flow
    entry/
      create.tsx               # Create entry  /entry/create?journalId=...&journalName=...
      [id].tsx                 # Entry detail  /entry/[id]?journalName=...
  template/
    _layout.tsx                # Stack — scoped to template tab
    index.tsx                  # Journal list — tap to edit, header button to create
    create.tsx                 # Create journal  /template/create (also the share-link target)
    edit.tsx                   # Edit journal  /template/edit?journalId=...
    settings.tsx               # App settings (gear button in the header), renders SettingsView
    paywall.tsx                # Nicky Pro paywall (modal)
  +native-intent.tsx           # Rewrites legacy share links nicky://create → /template/create
  search/
    _layout.tsx                # Stack — scoped to search tab
    index.tsx                  # Journal entry search
```

**Navigation flow:** Journal screen (chip select) → tap entry → `entry/[id]` (entry detail)

**View toggle:** The journal screen's header button pushes `days` with `animation: "none"`, hidden back button and swipe-back disabled, so it reads as a view switch; the Days screen's header button calls `router.back()`. There is no separate Days tab. Both screens share the header-left items (paywall, settings) via `useMainHeaderLeftItems`. Days stays a separate route (not a conditional render inside `index.tsx`) so its pan gesture mounts on its own screen

**Journal management:** Creating and editing journals happens only in the template tab. Locked journals require Face ID / Touch ID before the edit screen opens.

**Paywall per tab:** Each tab with a paywall has its own `paywall` route so opening it never switches tabs. Use `paywallHref(tab)` (`src/utils/navigation/paywall-href.ts`); `useProGate` picks the current tab from `useSegments`, and `handleSaveError(error, tab)` takes it as an argument.

**Key rule:** `NativeTabs` is the root navigator; `Stack` lives inside each tab group (`(journal)`, `template`, `search`). This keeps the tab bar visible when pushing screens.

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
| `@expensify/react-native-live-markdown`    | Live Markdown editor — import from `src/MarkdownTextInput` to avoid `parseExpensiMark` auto-loading `html-entities`. Custom `parser` must be a worklet.                                                 |
| `@ronradtke/react-native-markdown-display` | Full Markdown rendering (headers, lists, code blocks) for longText view mode                                                                                                                            |
| `expo-maps`                                | Apple Maps via `AppleMaps.View` — used for location field display                                                                                                                                       |
| `expo-image-picker`                        | Media field — pick images/videos from camera roll                                                                                                                                                       |
| `expo-local-authentication`                | Face ID / Touch ID — per-journal lock via `authenticateAsync()`                                                                                                                                         |
| `jszip`                                    | Zip file generation for bulk export (`Uint8Array` output)                                                                                                                                               |
| `react-native-purchases`                   | RevenueCat SDK — subscriptions, `nicky_pro` entitlement, offerings. Paywall UI is hand-built (see `purchases.md`)                                                                                       |
