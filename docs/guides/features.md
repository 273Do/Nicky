# Features

## AI Reflection Pipeline

On-device LLM generates daily reflections from journal entries:

1. **Entry collection** — `src/db/queries/entries.ts` fetches all entries for a given day (`DailyEntryObj[]`)
2. **Text conversion** — `src/utils/days/reflection/get-reflection.ts` formats entries into structured text (journal name + field labels/values)
3. **LLM inference** — `@react-native-ai/llama` downloads a GGUF model, Vercel `ai` package's `generateText()` runs inference with a system prompt
4. **Parsing** — JSON output is extracted via regex and validated with `reflectionSchema` (Zod)
5. **Storage** — Result saved to `reflections` table (one per day, keyed by midnight timestamp)

**Supported models** (defined in `src/constants/ai-models.ts`): Gemma 3 4B, Qwen 3 4B, Phi-4 Mini — all Q4_K_M quantization from HuggingFace.

**Settings** are stored in the `settings` KVS table, managed by `src/hooks/settings/use-ai-reflection-settings.ts`:

- `aiReflectionEnabled` — on/off toggle
- `aiReflectionModelId` — selected GGUF model
- `aiReflectionTime` — time of day to auto-generate (via `use-auto-reflection.ts`)

## Export / Import Pipeline

**Journal template export** (`src/utils/journal/export-journal.ts`):

- `exportJournal` — single journal: generates new IDs, signs with HMAC (`generateSignature`), writes JSON, shares via `expo-sharing`
- `exportAllJournals` — all journals: same signing per journal, bundled into a zip via `jszip`
- Common helper: `buildSignedJournal` generates signed export data for one journal

**Entry export** (`src/utils/entry/export-entry.ts`):

- `exportEntry` — single entry: plain text (field labels + values)
- `exportJournalEntries` — all entries in one journal: zip with text files
- `exportAllEntries` — all entries across all journals: zip with journal-name folders
- Common helpers: `buildEntryText` generates text for one entry, `exportEntriesAsZip` handles zip creation/sharing

**Journal template import** (`src/utils/journal/import-journal.ts`): validates JSON structure with Zod, verifies HMAC signature, returns `JournalDetail`.

**Key rules:**

- All exports write to `Paths.document` as a temporary staging area, then call `Sharing.shareAsync`, then **delete the temp file**. Forgetting the cleanup leaves files in the app's Documents directory.
- Zip files must be written as `Uint8Array` (`zip.generateAsync({ type: "uint8array" })`) — base64 encoding via `file.write(base64, { encoding: "base64" })` causes `NSCocoaErrorDomain Code=3328` on iOS.
- File names for entries use `toISOString().slice(0, 10)` for stable `YYYY-MM-DD` format (not `toLocaleDateString()` which is locale-dependent).

## Local Authentication (Per-Journal Lock)

Journals can be individually locked with Face ID / Touch ID via the `locked` column on the `journals` table.

### How it works

1. **Toggle** — Journal create/edit screen has a "Require Face ID" toggle that sets `journals.locked`
2. **Gate** — When a locked journal chip is tapped in `index.tsx`, `authenticate()` from `src/utils/local-auth.ts` is called before switching
3. **Session cache** — `unlockedIds` (a `Set<string>` in `useState`) tracks which journals have been authenticated this session. Once unlocked, a journal stays unlocked until the app is restarted
4. **Locked UI** — `EntryListView` switches from `List` to `VStack` when locked, showing a lock icon + "View Journal" tap target. Chips remain visible for switching journals
5. **FAB hidden** — The new-entry FAB is hidden while a journal is locked

### Key files

| File                                       | Role                                                        |
| ------------------------------------------ | ----------------------------------------------------------- |
| `src/utils/local-auth.ts`                  | `authenticate()` — wraps `expo-local-authentication`        |
| `src/app/(journal)/index.tsx`              | `handleSelectJournal`, `unlockJournal`, `unlockedIds` state |
| `src/components/entry/entry-list-view.tsx` | `locked` / `onUnlock` props, conditional List vs VStack     |
| `src/db/schemas/journals.ts`               | `locked` column                                             |
| `src/utils/journal/journal-field.ts`       | `locked` in `JournalMetaObj`                                |
| `plugins/with-infoplist-strings.js`        | `NSFaceIDUsageDescription` localization (en/ja)             |

### Notes

- `expo-local-authentication` requires a native rebuild (`pnpm prebuild && pnpm expo run:ios`) after first install
- `authenticateAsync({ promptMessage })` requires a non-empty string — use `i18n.t()` for localization
- On simulator, Face ID is unavailable; it falls back to passcode input. Use Simulator > Features > Face ID > Enrolled to test Face ID
