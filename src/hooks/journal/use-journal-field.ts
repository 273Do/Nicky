import { useState } from "react";

import * as Crypto from "expo-crypto";
import type { SFSymbol } from "sf-symbols-typescript";

/**
 * ジャーナルフィールドの種別
 */
export type FieldType =
  | "text"
  | "longText"
  | "number"
  | "media"
  | "check"
  | "date"
  | "time"
  | "location";

/**
 * ジャーナルフィールドの1項目
 */
export type FieldObj = {
  /** フィールドID */
  id: string;
  /** フィールド種別 */
  type: FieldType;
  /** 表示ラベル */
  label: string;
};

/**
 * FieldType に対応する SF Symbol アイコン名
 */
export const FIELD_ICONS: Record<FieldType, SFSymbol> = {
  text: "character.textbox",
  longText: "text.quote",
  number: "numbers.rectangle",
  media: "photo",
  check: "checkmark.circle",
  location: "mappin.and.ellipse",
  date: "calendar",
  time: "stopwatch",
};

/**
 * FieldType に対応する日本語表示名
 */
export const FIELD_LABELS: Record<FieldType, string> = {
  text: "Text",
  longText: "Long Text",
  number: "Number",
  media: "Media",
  check: "Check",
  location: "Location",
  date: "Date",
  time: "Time",
};

/**
 * 全 FieldType の配列
 */
export const FIELD_TYPES = Object.keys(FIELD_ICONS) as FieldType[];

/**
 * ジャーナルフィールドの管理フック
 * @returns
 * - fields 現在のフィールド一覧
 * - addField 新規フィールドを追加
 * - removeField フィールドを削除
 * - moveField フィールドを並び替え
 */
export const useJournalField = () => {
  const [fields, setFields] = useState<FieldObj[]>([]);

  /**
   * 新規フィールドを追加する
   * @param type 追加するフィールドの種別
   */
  const addField = (type: FieldType) => {
    const newField: FieldObj = {
      id: Crypto.randomUUID(),
      type,
      label: FIELD_LABELS[type],
    };
    setFields((prev) => [...prev, newField]);
  };

  /**
   * インデックス指定でフィールドを削除する（List.ForEach の onDelete 用）
   * @param indices 削除するインデックスの配列
   */
  const deleteField = (indices: number[]) => {
    setFields((prev) => prev.filter((_, i) => !indices.includes(i)));
  };

  /**
   * フィールドを並び替える
   * @param sourceIndices 移動元のインデックス配列
   * @param destination 移動先のインデックス
   */
  const moveField = (sourceIndices: number[], destination: number) => {
    setFields((prev) => {
      const next = [...prev];
      const moved = sourceIndices.map((i) => next[i]);
      sourceIndices.sort((a, b) => b - a).forEach((i) => next.splice(i, 1));
      next.splice(destination, 0, ...moved);
      return next;
    });
  };

  return { fields, addField, deleteField, moveField };
};
