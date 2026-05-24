import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getEntriesQuery } from "@/db/queries/entries";
import { type SortKey } from "@/utils/entry/consts";

import { buildPreviewEntry, groupByMonth, sortEntries } from "./preview";

type Params = {
  /** ジャーナル id */
  journalId: string;
  /** 検索テキスト */
  searchText?: string;
  /** ソートキー */
  sortKey?: SortKey;
};

/**
 * エントリー一覧を取得し、検索・ソート・月別グループ化まで行うフック
 * @param grouped グループ化されたエントリー
 */
export function useEntryList({
  journalId,
  searchText = "",
  sortKey = "dateDesc",
}: Params) {
  const { data: entries } = useLiveQuery(getEntriesQuery(journalId), [
    journalId,
  ]);

  const previewEntries = entries.map(buildPreviewEntry);

  const filtered = searchText
    ? previewEntries.filter(
        (e) => e.title.includes(searchText) || e.preview.includes(searchText),
      )
    : previewEntries;

  const sorted = sortEntries(filtered, sortKey);
  const grouped = groupByMonth(sorted);

  return { grouped };
}
