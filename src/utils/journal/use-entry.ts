import { useState } from "react";

import type { FieldType } from "@/core/constants";
import { FieldlObj } from "@/db/schemas";

export type EntryObj = {
  id: string;
  date: Date;
  title: string;
  preview: string;
  bookmark?: boolean;
};

export type FieldValue = string | number | boolean | Date | null;

/**
 * 各エントリー入力のデフォルト値
 * @param type フィールドタイプ
 */
const getDefaultValue = (type: FieldType): FieldValue => {
  switch (type) {
    case "text":
    case "longText":
      return "";
    case "number":
      return null;
    case "check":
      return false;
    case "date":
    case "time":
      return new Date();
    case "media":
    case "location":
      return null;
  }
};

/**
 * エントリーフォームの値を管理するフック
 * @param fields ジャーナルに紐づくフィールド一覧
 * @returns
 * - values 現在のフィールドの値
 * - setValue フィールドに値を格納する関数
 */
export const useEntry = (fields: FieldlObj[]) => {
  const [values, setValues] = useState<Record<string, FieldValue>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, getDefaultValue(f.type)])),
  );

  const setValue = (id: string, value: FieldValue) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  return { values, setValue };
};
