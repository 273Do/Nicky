import { useEffect, useRef, useState } from "react";

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
import {
  type FieldValue,
  getDefaultValue,
  serializeValue,
  validateFieldValue,
} from "@/utils/entry/field-value";

export type { FieldValue } from "@/utils/entry/field-value";
export { deserializeValue } from "@/utils/entry/field-value";

/**
 * エントリーフォームの値を管理するフック
 * ref ベースのため、入力のたびに再レンダリングが発生しない
 * @param fields ジャーナルに紐づくフィールド一覧
 * @param initialValues 編集時の初期値。undefined=新規作成、null=ロード中、Record=編集準備完了
 * @returns
 * - values 現在のフィールドの値
 * - setValue フィールドに値を格納する関数
 * - createEntry 新規エントリーをDBに保存する関数
 * - updateEntry 既存エントリーをDBに更新する関数
 */
export const useEntry = (fields: FieldObj[], initialValues?: Record<string, FieldValue> | null) => {
  const computeInit = (): Record<string, FieldValue> => {
    if (!fields || fields.length === 0 || initialValues === null) return {};
    return (
      initialValues ??
      Object.fromEntries(fields.map((f) => [f.id, getDefaultValue(f.type, f.label)]))
    );
  };

  // State-based initialization (avoids reading refs during render)
  const [values, setValues] = useState(computeInit);

  // Deferred init: for create mode where fields load asynchronously via useLiveQuery
  if (Object.keys(values).length === 0 && fields && fields.length > 0 && initialValues !== null) {
    setValues(computeInit());
  }

  // Internal ref for mutation in event handlers (no re-render on every keystroke)
  const valuesRef = useRef(values);
  useEffect(() => {
    if (Object.keys(values).length > 0) {
      valuesRef.current = values;
    }
  }, [values]);

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

    // フィールドごとのバリデーション
    for (const field of fields) {
      validateFieldValue(valuesRef.current[field.id], field.type, field.label);
    }

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

    // フィールドごとのバリデーション
    for (const field of fields) {
      validateFieldValue(valuesRef.current[field.id], field.type, field.label);
    }

    const values = Object.entries(valuesRef.current).map(([fieldId, value]) => ({
      fieldId,
      value: serializeValue(value),
    }));

    z.array(z.object({ fieldId: z.string().min(1), value: z.string().nullable() }))
      .min(1)
      .parse(values);

    await updateEntryValues(entryId, values);
  };

  return { values, setValue, createEntry, updateEntry };
};
