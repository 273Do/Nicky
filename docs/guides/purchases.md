# In-App Purchases (RevenueCat)

iOS only. Monthly + yearly auto-renewable subscriptions, sold through RevenueCat with a hand-built SwiftUI paywall (`react-native-purchases-ui` is intentionally **not** used).

## Data model

```
App Store Connect products (monthly / yearly)
  → RevenueCat entitlement  nicky_pro
  → RevenueCat offering      default
      ├ package  monthly
      └ package  yearly
```

Identifiers live in `src/constants/purchases.ts` (`ENTITLEMENT_ID`, `OFFERING_ID`, `PLANS`). They must match the dashboard exactly. **A product that is not attached to `nicky_pro` lets users pay without unlocking anything.**

## API keys

| Env var                               | Prefix  | Used in                |
| ------------------------------------- | ------- | ---------------------- |
| `EXPO_PUBLIC_REVENUECAT_IOS_TEST_KEY` | `test_` | dev builds (`__DEV__`) |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY`      | `appl_` | release builds         |

`src/utils/purchases/api-key.ts` picks one by `__DEV__` and `safeParse`s it. If the key is missing, the SDK is never configured and the app still runs with purchases disabled — this is deliberate, unlike `export-journal.ts` which throws on a missing secret.

The `test_` key is the **RevenueCat Test Store**: real-looking test purchases without any App Store Connect setup. The React Native SDK does not expose `forceAllowTestStoreInReleaseBuilds`, so Test Store only works in debug builds. Swap to the `appl_` key before shipping.

`EXPO_PUBLIC_*` is inlined by Metro at bundle time → run `pnpm start --clear` after editing `.env.local`.

## Initialization

`src/utils/purchases/configure.ts` runs at module scope and is imported for its side effect in `src/app/_layout.tsx`, next to `@/i18n`:

- Runs once, before any render, independent of `DrizzleProvider` (which only gates rendering, not module evaluation)
- Guarded by `Platform.OS !== "ios"` (also keeps the web static export safe) and by a module-level `configured` flag
- **`Purchases.isConfigured` is a method returning `Promise<boolean>`** — `if (Purchases.isConfigured)` is always truthy. Use the module flag
- No `appUserID` is passed: the app has no login, so RevenueCat generates anonymous IDs

## State: the external store pattern

There is no `useEffect` + `setState` anywhere in this feature. Both stores are module-level with a `subscribe` / `getSnapshot` pair read through `useSyncExternalStore` (see `docs/guides/patterns.md`).

| File                                        | Hook                                      | Contents                                       |
| ------------------------------------------- | ----------------------------------------- | ---------------------------------------------- |
| `src/utils/purchases/subscription-store.ts` | `src/hooks/purchases/use-subscription.ts` | `{ isPro, loading }`                           |
| `src/utils/purchases/offerings-store.ts`    | `src/hooks/purchases/use-offerings.ts`    | `{ monthly, annual, loading, failed, reload }` |

- `startSubscriptionSync()` registers `Purchases.addCustomerInfoUpdateListener` once (never torn down) and seeds the first value with `getCustomerInfo()`. Purchases, restores, renewals and expirations therefore reach the UI on their own — screens never write the state back
- The snapshot object is **replaced, never mutated**, and only when a value actually changes. In-place mutation breaks `useSyncExternalStore`'s change detection
- Offerings are fetched once, when the first subscriber mounts (i.e. when the paywall opens)
- Packages are looked up by dashboard identifier first (`monthly` / `yearly`), falling back to `PACKAGE_TYPE`. The `offering.monthly` / `offering.annual` shortcuts only work for the built-in `$rc_` identifiers

## Purchase flow

`src/utils/purchases/purchase.ts`:

- `purchasePackage(pkg)` → `true` when `nicky_pro` became active
- `restorePurchases()` → `true` when `nicky_pro` became active
- `openManageSubscription()` → `Purchases.showManageSubscriptions()`, falling back to `itms-apps://apps.apple.com/account/subscriptions` (the native sheet does not work with Test Store)

Cancellation is **not** an error: it is detected with `code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR` and returns `false` silently. `PurchasesError.userCancelled` is deprecated — do not use it. Other failures `console.warn("[purchases]", e)` and show an `Alert.alert` with `error.purchaseFailed*` / `error.restoreFailed*`.

## UI

| File                                               | Role                                                                         |
| -------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/app/days/paywall.tsx`                         | Route, registered in `src/app/days/_layout.tsx` as `presentation: "modal"`   |
| `src/components/purchases/paywall-view.tsx`        | The paywall itself (`Host` → `ScrollView`, segmented `Picker`, CTA, restore) |
| `src/components/purchases/paywall-feature-row.tsx` | One benefit row (SF Symbol + title + description)                            |
| `src/components/settings/subscription.tsx`         | Settings section: status, manage, restore                                    |

- Prices always come from `pkg.product.priceString` / `pricePerMonthString`. Never format currency by hand
- The route lives in the `days` stack because there is no root Stack (`NativeTabs` is the root). To open the paywall from another tab, add `src/app/(journal)/paywall.tsx` rendering the same `<PaywallView />` and register it in that stack
- Terms and privacy links are required on the paywall by App Store review. URLs are in `src/constants/legal.ts` — **currently placeholders**
- "Restore Purchases" stays visible to non-subscribers (Apple requirement) and is in both the paywall and Settings

## Gating a feature

```tsx
const { isPro, loading } = useSubscription();
```

- Do **not** use the `disabled()` modifier: a disabled SwiftUI control swallows taps, leaving a dead row with no explanation. Keep the row live, show `Image systemName="lock.fill"` in `secondaryLabel`, and `router.navigate("/days/paywall")` on press
- A `Toggle` cannot intercept before its value flips — replace it with a `Button` + `HStack` row
- For non-interactive content, render an upsell `VStack` (`purchases.unlockTitle` / `unlockMessage` / `unlock`) instead, following the List ↔ VStack rule in `swiftui-rules.md`
- Gate the **execution path** too, not just the UI (e.g. the conditions in `use-auto-reflection.ts`). Inside a handler, read the freshest value with `getSubscriptionSnapshot()`
- Suppress the lock badge while `loading` so subscribers never see a flash of it

## Anonymous App User IDs

There is no login, so every install is a new anonymous customer (`$RCAnonymousID:…`). Purchases do **not** follow the user to another device or survive a reinstall — `restorePurchases()` is the only recovery path. If a login is ever added, call `Purchases.logIn()` to merge the anonymous ID.

## Dashboard / App Store Connect checklist

1. Paid Apps agreement signed (otherwise offerings come back empty)
2. Subscription group + monthly/yearly auto-renewable products, localized for en + ja
3. **In-App Purchase Key (.p8) + Issuer ID** uploaded to RevenueCat — mandatory for StoreKit 2 (SDK v5+), otherwise transactions are never recorded. Never commit the `.p8`
4. Products attached to entitlement `nicky_pro`
5. Offering `default` set as Current, with packages `monthly` and `yearly`
6. Sandbox tester created (Users and Access → Sandbox Testers)

## Testing

```bash
pnpm prebuild          # required after installing the SDK
pnpm expo run:ios      # dev build; Expo Go cannot purchase
pnpm start --clear     # after editing .env.local
```

- Test Store: works in the simulator, no App Store Connect needed
- Real StoreKit: physical device + sandbox tester (iOS Settings → App Store → Sandbox Account). A `.storekit` file is not an option here — `ios/` is gitignored and `prebuild --clean` wipes Xcode scheme state
- Sandbox renewals are accelerated (1 year → 1 hour; 24 h on TestFlight, then auto-cancel after 6 renewals). Odd expiry dates are expected
- Restore test: delete the app (the anonymous ID is lost) → reinstall → Restore Purchases
- Check RevenueCat → Customers for `nicky_pro` active, and Customer History for the transaction. A successful purchase with no transaction recorded means the In-App Purchase Key is missing

## Adding Android later

Add the Play Store app in RevenueCat, a `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` (`goog_`), and branch on `Platform.OS` in `api-key.ts` / `configure.ts`. The stores, hooks and paywall need no changes.
