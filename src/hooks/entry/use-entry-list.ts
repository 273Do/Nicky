import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getEntriesQuery } from "@/db/queries/entries";
import { buildPreviewEntry } from "@/utils/entry/preview";

type Params = {
  /** ジャーナル id */
  journalId: string;
  /** ブックマークのみ表示 */
  bookmarkOnly?: boolean;
};

/**
 * エントリー一覧を取得し、フィルターまで行うフック
 */
export function useEntryList({ journalId, bookmarkOnly = false }: Params) {
  const { data: entries } = useLiveQuery(getEntriesQuery(journalId), [journalId]);

  const previewEntries = entries.map(buildPreviewEntry);

  const filtered = bookmarkOnly ? previewEntries.filter((e) => e.bookmark) : previewEntries;

  // デフォルトは新しい順
  const sorted = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return { entries: sorted };
}
