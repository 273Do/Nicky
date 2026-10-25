# Code Style

- **Import order:** external → internal (`@/`) → relative; always separated by newlines
- **Path alias:** `@/*` → `src/*`
- **TypeScript:** strict mode enabled
- **Formatter:** Prettier (enforced via ESLint)
- **React Compiler:** enabled — do not manually add `useMemo`/`useCallback` unless there is a specific reason
- **Event handler note:** extract `e.nativeEvent.text` synchronously before passing to async state updaters (React synthetic event pooling)
- **i18n:** All user-facing strings use `react-i18next`. In components use `useTranslation()`, in utility files import `i18n` from `@/i18n` directly. Locale files are at `src/i18n/locales/{en,ja}.json`.
