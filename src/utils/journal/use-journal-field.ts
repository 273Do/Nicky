import type { SFSymbol } from "expo-symbols";

import { useState } from "react";

import * as Crypto from "expo-crypto";
import { z } from "zod";

import { fieldTypeSchema, type FieldType, JOURNAL_ICONS } from "@/core/constants";
import { storeJournal, updateJournal as updateJournalQuery } from "@/db/queries/journals";
import { fieldInsertSchema, type JournalObj } from "@/db/schemas";
import { hexColorSchema } from "@/utils/journal/color";

/**
 * ジャーナルメタ情報のスキーマ
 */
export const journalMetaSchema = z.object({
  name: z.string().trim().min(1).max(20), // 20文字まで
  color: hexColorSchema,
  icon: z.string().min(1) as z.ZodType<SFSymbol>,
});
export type JournalMetaObj = z.infer<typeof journalMetaSchema>;

/**
 * ジャーナル作成フォームのフィールド下書き（journalId・sortOrder なし）
 */
export const fieldDraftSchema = fieldInsertSchema
  .omit({ journalId: true, sortOrder: true })
  .extend({ label: z.string().trim().min(1).max(30) }); // 30 文字まで
export type FieldDraftObj = z.infer<typeof fieldDraftSchema>;

/**
 * sortOrder 確定済み・journalId 未割当のフィールド（DB 保存直前）
 */
export const fieldWithSortSchema = fieldInsertSchema.omit({ journalId: true });
export type FieldWithSortObj = z.infer<typeof fieldWithSortSchema>;

/**
 * 全 FieldType の配列
 */
export const FIELD_TYPES: FieldType[] = fieldTypeSchema.options;

const defaultMeta: JournalMetaObj = {
  name: "",
  color: "#6d7ce1",
  icon: JOURNAL_ICONS[0],
};

/**
 * ジャーナルフィールドに関するフック
 * @param meta ジャーナルのメタ情報(編集用)
 * @param fields 現在のフィールド一覧(編集用)
 * @returns
 * - fields 現在のフィールド一覧
 * - addField 新規フィールドを追加する関数
 * - renameFileld フィールドのラベルを更新する関数
 * - removeField フィールドを削除する関数
 * - moveField フィールドを並び替えする関数
 * - meta ジャーナルのメタ情報
 * - setMeta ジャーナルのメタ情報をセットする関数
 * - createJournal 新規ジャーナルを作成する関数
 * - updateJournal ジャーナルを更新する関数
 * - formDisabled フォームが送信可能かどうかのフラグ
 */
export const useJournalField = (initialData?: {
  meta: JournalMetaObj;
  fields: FieldDraftObj[];
}) => {
  const [fields, setFields] = useState<FieldDraftObj[]>(initialData?.fields ?? []);
  const [meta, setMeta] = useState<JournalMetaObj>(initialData?.meta ?? defaultMeta);

  /**
   * 新規フィールドを追加する
   * @param type 追加するフィールドの種別
   */
  const addField = (type: FieldType): void => {
    const newField: FieldDraftObj = {
      id: Crypto.randomUUID(),
      type,
      label: "",
    };
    setFields((prev) => [...prev, newField]);
  };

  /**
   * フィールドのラベルを更新する関数
   * @param id ラベルを編集する id
   * @param newLabel 新しいラベル
   */
  const renameField = (id: string, newLabel: string): void => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, label: newLabel } : field)),
    );
  };

  /**
   * インデックス指定でフィールドを削除する（List.ForEach の onDelete 用）
   * @param indices 削除するインデックスの配列
   */
  const deleteField = (indices: number[]): void => {
    setFields((prev) => prev.filter((_, i) => !indices.includes(i)));
  };

  /**
   * フィールドを並び替える
   * @param sourceIndices 移動元のインデックス配列
   * @param destination 移動先のインデックス
   */
  const moveField = (sourceIndices: number[], destination: number): void => {
    setFields((prev) => {
      const next = [...prev];
      const moved = sourceIndices.map((i) => next[i]);
      sourceIndices.sort((a, b) => b - a).forEach((i) => next.splice(i, 1));
      next.splice(destination, 0, ...moved);
      return next;
    });
  };

  /**
   * formDisabled フォームが送信可能かどうかのフラグ
   */
  const formDisabled =
    fields.length === 0 ||
    meta.name.trim().length === 0 ||
    fields.some((field) => field.label.trim().length === 0);

  /**
   * 新規ジャーナルをフィールドと共にDBに保存する
   */
  const createJournal = async (): Promise<JournalObj> => {
    journalMetaSchema.parse(meta);
    z.array(fieldDraftSchema).min(1).parse(fields);

    const now = Date.now();

    const newJournal: JournalObj = {
      id: Crypto.randomUUID(),
      name: meta.name,
      icon: meta.icon,
      color: meta.color,
      createdAt: now,
      updatedAt: now,
    };

    const newFieldsFieldObj: FieldWithSortObj[] = fields.map((field, i) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      sortOrder: i,
    }));

    await storeJournal(newJournal, newFieldsFieldObj);

    return newJournal;
  };

  /**
   * 既存ジャーナルのメタ情報とフィールドをDBに更新する
   * @param journalId ジャーナルID
   */
  const updateJournal = async (journalId: string): Promise<void> => {
    journalMetaSchema.parse(meta);
    z.array(fieldDraftSchema).min(1).parse(fields);

    const fieldUpdates: FieldWithSortObj[] = fields.map((field, i) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      sortOrder: i,
    }));

    await updateJournalQuery(journalId, meta, fieldUpdates);
  };

  return {
    fields,
    setFields,
    addField,
    renameField,
    deleteField,
    moveField,

    meta,
    setMeta,
    createJournal,
    updateJournal,

    formDisabled,
  };
};
