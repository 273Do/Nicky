import { useRef } from "react";

import * as Crypto from "expo-crypto";
import { z } from "zod";

import { storeEntry, updateEntryValues } from "@/db/queries/entries";
import {
  entrySelectSchema,
  entryValueInsertSchema,
  type EntryObj,
  type EntryValueObj,
  type FieldObj,
} from "@/db/schemas";
import { type FieldValue, getDefaultValue, serializeValue } from "@/utils/entry/field-value";

export type { FieldValue } from "@/utils/entry/field-value";
export { deserializeValue } from "@/utils/entry/field-value";

/**
 * エントリーフォームの値を管理するフック
 * ref ベースのため、入力のたびに再レンダリングが発生しない
 * @param fields ジャーナルに紐づくフィールド一覧
 * @param initialValues 編集時の初期値。undefined=新規作成、null=ロード中、Record=編集準備完了
 * @returns
 * - valuesRef 現在のフィールドの値
 * - setValue フィールドに値を格納する関数
 * - createEntry 新規エントリーをDBに保存する関数
 * - updateEntry 既存エントリーをDBに更新する関数
 */
export const useEntry = (fields: FieldObj[], initialValues?: Record<string, FieldValue> | null) => {
  const valuesRef = useRef<Record<string, FieldValue>>({});
  const initialized = useRef(false);

  if (!initialized.current && fields && fields.length > 0) {
    const isCreateMode = initialValues === undefined;
    const isEditModeReady = initialValues !== null && initialValues !== undefined;

    if (isCreateMode || isEditModeReady) {
      initialized.current = true;
      valuesRef.current =
        initialValues ?? Object.fromEntries(fields.map((f) => [f.id, getDefaultValue(f.type)]));
    }
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
   * 新規エントリーを値と共にDBに保存する
   * @param journalId ジャーナル id
   */
  const createEntry = async (journalId: string): Promise<EntryObj> => {
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

    entrySelectSchema.parse(newEntry);
    z.array(entryValueInsertSchema).parse(newValues);

    await storeEntry(newEntry, newValues);

    return newEntry;
  };

  /**
   * 既存エントリーのフィールド値をDBに更新する
   * @param entryId エントリー id
   */
  const updateEntry = async (entryId: string): Promise<void> => {
    z.string().min(1).parse(entryId);

    const values = Object.entries(valuesRef.current).map(([fieldId, value]) => ({
      fieldId,
      value: serializeValue(value),
    }));

    z.array(z.object({ fieldId: z.string().min(1), value: z.string().nullable() }))
      .min(1)
      .parse(values);

    await updateEntryValues(entryId, values);
  };

  return { valuesRef, setValue, createEntry, updateEntry };
};
