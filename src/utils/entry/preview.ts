import { FieldType } from "@/constants/journal";
import { EntryDetailObj } from "@/db/queries/entries";

import { formatDate, formatTime } from "../date";
import { parseLocation } from "./field-value";

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
export const formatFieldValue = (value: string | null, type: FieldType): string => {
  if (!value) return "";
  switch (type) {
    case "date":
      return formatDate(new Date(Number(value)));
    case "time":
      return formatTime(new Date(Number(value)));
    case "check":
      return value === "true" ? "✓" : "";
    case "media":
      return value ? "📷" : "";
    case "location":
      return parseLocation(value)?.address ?? value;
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

  // フィールド順に並び替え
  const sorted = [...values].sort((a, b) => a.field.sortOrder - b.field.sortOrder);

  // 1つめのフィールドをタイトルに設定し、値がなければ作成日にフォールバック
  const first = sorted[0];
  let titleFromField = "";
  if (first) {
    if (first.field.type === "check") {
      titleFromField = first.value === "true" ? `${first.field.label}: ✓` : first.field.label;
    } else {
      titleFromField = formatFieldValue(first.value, first.field.type);
    }
  }

  const title = titleFromField || formatDate(new Date(createdAt));

  // プレビューは2つ目以降のフィールドを順に並べる
  const preview = sorted
    .slice(1)
    .map((v) => formatFieldValue(v.value, v.field.type))
    .filter(Boolean)
    .join(" "); // 全ての値を繋げることで検索できる

  return {
    id,
    createdAt: new Date(createdAt),
    title,
    preview,
    bookmark,
  };
};
