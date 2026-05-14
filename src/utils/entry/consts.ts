/**
 * ソートキー
 */
export type SortKey =
  | "dateDesc"
  | "dateAsc"
  | "titleAsc"
  | "titleDesc"
  | "bookmark";

/**
 * ソートラベル
 */
export const SORT_LABELS: Record<SortKey, string> = {
  dateDesc: "Newest First",
  dateAsc: "Oldest First",
  titleAsc: "Title (A→Z)",
  titleDesc: "Title (Z→A)",
  bookmark: "Bookmarked",
};
