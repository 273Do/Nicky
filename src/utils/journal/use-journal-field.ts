import { useState } from "react";

import * as Crypto from "expo-crypto";
import { SFSymbol } from "expo-symbols";

import { FIELD_ICONS, FieldType, JOURNAL_ICONS } from "@/core/constants";
import { storeJournal } from "@/db/queries/journals";
import { FieldlObj, JournalObj } from "@/db/schemas";

/**
 * ジャーナルメタ情報の型
 */
export type JournalMetaObj = {
  name: string;
  color: string;
  icon: SFSymbol;
};

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
 * 全 FieldType の配列
 */
export const FIELD_TYPES = Object.keys(FIELD_ICONS) as FieldType[];

/**
 * ジャーナルフィールドの管理フック
 * @returns
 * - fields 現在のフィールド一覧
 * - addField 新規フィールドを追加する関数
 * - renameFileld フィールドのラベルを更新する関数
 * - removeField フィールドを削除する関数
 * - moveField フィールドを並び替えする関数
 * - meta ジャーナルのメタ情報
 * - setMeta ジャーナルのメタ情報をセットする関数
 * - createJournal 新規ジャーナルを作成する関数
 * - formDisabled フォームが送信可能かどうかのフラグ
 */
export const useJournalField = () => {
  const [fields, setFields] = useState<FieldObj[]>([]);

  const initialState = {
    name: "",
    color: "#007AFF",
    icon: JOURNAL_ICONS[0],
  };

  const [meta, setMeta] = useState<JournalMetaObj>(initialState);

  /**
   * 新規フィールドを追加する
   * @param type 追加するフィールドの種別
   */
  const addField = (type: FieldType): void => {
    const newField: FieldObj = {
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
      prev.map((field) =>
        field.id === id ? { ...field, label: newLabel } : field,
      ),
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
    meta.name.length === 0 ||
    fields.some((field) => field.label.length === 0);

  /**
   * 新規ジャーナルをフィールドと共にDBに保存する
   */
  const createJournal = async (): Promise<JournalObj> => {
    const now = Date.now();

    const newJournal: JournalObj = {
      id: Crypto.randomUUID(),
      name: meta.name,
      icon: meta.icon,
      color: meta.color,
      createdAt: now,
      updatedAt: now,
    };

    const newFieldsFieldlObj: FieldlObj[] = fields.map((field, i) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      sortOrder: i,
    }));

    await storeJournal(newJournal, newFieldsFieldlObj);

    return newJournal;
  };

  return {
    fields,
    addField,
    renameField,
    deleteField,
    moveField,

    meta,
    setMeta,
    createJournal,

    formDisabled,
  };
};
