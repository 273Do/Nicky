import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { type DailyEntryObj, getAllEntriesWithJournalQuery } from "@/db/queries/entries";
import { buildPreviewEntry } from "@/utils/entry/preview";

/** 検索対象の文字列（タイトル + 全フィールドの表示値） */
const toSearchText = (entry: DailyEntryObj) => {
  const { title, preview } = buildPreviewEntry(entry);
  return `${title} ${preview}`.toLowerCase();
};

/**
 * キーワードでエントリーを検索するフック
 * - 空白区切りの全キーワードを含むエントリーを新しい順で返す
 * - ロック中のジャーナルは検索対象外
 * @param query 検索キーワード
 */
export const useSearchEntries = (query: string) => {
  const { data: entries } = useLiveQuery(getAllEntriesWithJournalQuery());

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return entries
    .filter((e) => !e.journal.locked)
    .filter((e) => {
      const text = toSearchText(e);
      return terms.every((term) => text.includes(term));
    })
    .sort((a, b) => b.createdAt - a.createdAt);
};
