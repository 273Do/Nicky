import { useRef } from "react";

import * as Crypto from "expo-crypto";

import type { FieldType } from "@/core/constants";
import { storeEntry } from "@/db/queries/entries";
import { EntryObj, EntryValueObj, FieldlObj } from "@/db/schemas";

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
  const setValue = (fieldId: string, value: FieldValue): void => {
    valuesRef.current[fieldId] = value;
  };

  /**
   * 新規エントリーをDBに保存する
   * @param journalId ジャーナル id
   */
  /** FieldValue を DB の text 型に変換 */
  const serializeValue = (value: FieldValue): string | null => {
    if (value === null) return null;
    if (value instanceof Date) return String(value.getTime());
    return String(value);
  };

  /**
   * 新規エントリーを値と共にDBに保存する
   * @param journalId ジャーナル id
   */
  const createEntry = async (journalId: string) => {
    const now = Date.now();

    const newEntry: EntryObj = {
      id: Crypto.randomUUID(),
      journalId,
      bookmark: false,
      createdAt: now,
      updatedAt: now,
    };

    const newValues: EntryValueObj[] = Object.entries(valuesRef.current).map(
      ([fieldId, value]) => ({
        id: Crypto.randomUUID(),
        entryId: newEntry.id,
        fieldId,
        value: serializeValue(value),
      }),
    );

    await storeEntry(newEntry, newValues);

    return newEntry;
  };

  return { valuesRef, setValue, createEntry };
};
