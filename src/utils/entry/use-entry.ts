import { useRef } from "react";

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
 * ref ベースのため、入力のたびに再レンダリングが発生しない
 * @param fields ジャーナルに紐づくフィールド一覧
 * @returns
 * - valuesRef 現在のフィールドの値
 * - setValue フィールドに値を格納する関数
 * - createEntry 新規エントリーをDBに保存する関数
 */
export const useEntry = (fields: FieldlObj[] | undefined) => {
  const valuesRef = useRef<Record<string, FieldValue>>({});
  const initialized = useRef(false);

  // fields が初めてロードされたタイミングで一度だけ初期化
  if (!initialized.current && fields && fields.length > 0) {
    initialized.current = true;
    valuesRef.current = Object.fromEntries(
      fields.map((f) => [f.id, getDefaultValue(f.type)]),
    );
  }

  /**
   * フィールドに値を格納する
   * @param id フィールド id
   * @param value フィールドの値
   */
  const setValue = (id: string, value: FieldValue): void => {
    valuesRef.current[id] = value;
  };

  /**
   * 新規エントリーをDBに保存する
   */
  const createEntry = async () => {
    console.log(valuesRef.current);
  };

  return { valuesRef, setValue, createEntry };
};
