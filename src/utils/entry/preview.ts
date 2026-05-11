import { SortKey } from "@/app/(journal)/[id]";
import { FieldType } from "@/core/constants";
import { EntryDetailObj } from "@/db/queries/entries";

import { formatDate, formatTime, formatYearMonth } from "../date";

export type PreviewEntryObj = {
  /** エントリー id */
  id: string;
  /** タイトル */
  title: string;
  /** プレビュー */
  preview: string;
  /** ブックマーク */
  bookmark: boolean;
  /** 日付 */
  createdAt: Date;
};

/**
 * DB の value 文字列をフィールド型に応じた表示文字列に変換
 * @param value 値
 * @param type フィールドタイプ
 */
export const formatFieldValue = (
  value: string | null,
  type: FieldType,
): string => {
  if (!value) return "";
  switch (type) {
    case "date":
      return formatDate(new Date(Number(value)));
    case "time":
      return formatTime(new Date(Number(value)));
    case "check":
      return value === "true" ? "✓" : "";
    default:
      return value;
  }
};

/**
 * DB のエントリーをプレビュー表示用に変換する
 * @param entry エントリー詳細
 */
export const buildPreviewEntry = (entry: EntryDetailObj): PreviewEntryObj => {
  const { id, createdAt, bookmark, values } = entry;

  // エントリー順に並び替え
  const sorted = [...values].sort(
    (a, b) => a.field.sortOrder - b.field.sortOrder,
  );

  // 1つめのフィールドをタイトルに設定する
  const title = formatFieldValue(
    sorted[0]?.value ?? null,
    sorted[0]?.field.type,
  );

  // プレビューは2つ目以降のフィールドを順に並べる
  const preview = sorted
    .slice(1)
    .map((v) => formatFieldValue(v.value, v.field.type as FieldType))
    .filter(Boolean)
    .join(" ");

  return {
    id,
    createdAt: new Date(createdAt),
    title,
    preview,
    bookmark,
  };
};

/**
 * エントリーを並び替える
 * @param previewEntries プレビューエントリー一覧
 * @param sortKey ソートキー
 */
export const sortEntries = (
  previewEntries: PreviewEntryObj[],
  sortKey: SortKey,
): PreviewEntryObj[] => {
  switch (sortKey) {
    case "dateDesc":
      return [...previewEntries].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    case "dateAsc":
      return [...previewEntries].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
    case "titleAsc":
      return [...previewEntries].sort((a, b) => a.title.localeCompare(b.title));
    case "titleDesc":
      return [...previewEntries].sort((a, b) => b.title.localeCompare(a.title));
    case "bookmark":
      return [...previewEntries].sort(
        (a, b) => (b.bookmark ? 1 : 0) - (a.bookmark ? 1 : 0),
      );
  }
};

/**
 * 月毎にエントリー一覧を分割する関数
 * @param previewEntries プレビューエントリー一覧
 */
export const groupByMonth = (
  entries: PreviewEntryObj[],
): { month: string; entries: PreviewEntryObj[] }[] => {
  const map = new Map<string, PreviewEntryObj[]>();
  for (const entry of entries) {
    const key = `${entry.createdAt.getFullYear()}-${entry.createdAt.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries()).map(([, entries]) => ({
    month: formatYearMonth(entries[0].createdAt),
    entries,
  }));
};
