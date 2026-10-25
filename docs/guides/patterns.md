# Code Patterns

## Sub-component Pattern for Forms with `useRef` State

Hooks that use `useRef` + an `initialized` flag (e.g. `useEntry`, `useJournalField`) only initialize once per mount. To ensure they pick up fresh data when switching to edit mode, **mount the form as a separate child component** rather than toggling visibility on the parent:

```tsx
// Correct — EntryEditForm mounts fresh each time editMode becomes true
{editMode && <EntryEditForm entry={entry} onSave={...} />}

// Wrong — form is always mounted; useRef init won't re-run with new data
<EntryCreateView ... />  // toggled visible/hidden
```

This pattern is used in `entry/[id].tsx` (`EntryEditForm`) and `edit.tsx` (`JournalEditForm`).

## Field Value Serialization

All field values are stored as `text | null` in `entry_values.value`. Serialization/deserialization lives in `src/utils/entry/use-entry.ts`:

- `serializeValue(FieldValue) → string | null` — converts to DB text
- `deserializeValue(string | null, FieldType) → FieldValue` — converts from DB text
- `FieldType` values: `"text" | "longText" | "number" | "media" | "check" | "date" | "time" | "location" | "rating" | "link"`
- Dates/times are stored as millisecond timestamps (`String(date.getTime())`)

`buildEntryFormData` in `src/utils/entry/entry-form.ts` extracts fields (sorted by `sortOrder`) and initial values from an `EntryDetailObj`.

## Entry Preview Pipeline

`EntryDetailObj` (raw DB join) → `PreviewEntryObj` (display) via `buildPreviewEntry` in `src/utils/entry/preview.ts`:

- First field value = title (falls back to formatted `createdAt`)
- Remaining field values joined with spaces = preview (also used for search)
- Entries grouped by month for the list view (`groupByMonth`)

## Keyboard Dismiss Rule

Always call `Keyboard.dismiss()` **before** any `async` save operation that triggers navigation. Skipping this causes a `RemoteTextInput` session crash on iOS when the keyboard is mid-input as the screen unmounts.

## Settings Hook Pattern

Settings are stored in the `settings` KVS table. Hooks follow this pattern (`src/hooks/settings/`):

```ts
const KEY = "some_setting";
export const useSomeSetting = () => {
  const { data: rows } = useSettingsQuery();
  const value = (rows.find((r) => r.key === KEY)?.value ?? "default") === "true";
  const setValue = async (v: boolean) => {
    await setSetting(KEY, String(v));
  };
  return { value, setValue } as const;
};
```

## External Store Subscription Pattern

For state that comes from an external event source (a native SDK listener, not the DB), use a module-level store read with `useSyncExternalStore` — **never** `useEffect` + `setState`. Example: `src/utils/purchases/subscription-store.ts` + `src/hooks/purchases/use-subscription.ts`.

```ts
let snapshot: Snapshot = initial;
const listeners = new Set<() => void>();

// Replace the object, never mutate it, and only when a value actually changed
const setSnapshot = (next: Snapshot) => {
  if (isEqual(next, snapshot)) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSnapshot = () => snapshot;
```

```ts
const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
```

**Key rules:**

- Mutating the snapshot in place breaks change detection — always assign a new object
- Skip the notification when nothing changed, otherwise every listener re-renders on each event
- Pass `getSnapshot` as the third argument too (`getServerSnapshot`) since `app.json` uses `web.output: "static"`
- Register the underlying native listener once (a module-level `started` flag), not per subscriber

## Journal Meta Schema

`JournalMetaObj` in `src/utils/journal/journal-field.ts` defines the editable journal properties: `name`, `color`, `icon`, `oneEntry`, `locked`, `notificationTime`. This schema is used by both create and edit flows via `useJournalField` hook.
