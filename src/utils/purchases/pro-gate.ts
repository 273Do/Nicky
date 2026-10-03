import { SFSymbol } from "expo-symbols";

import { type FieldType, JOURNAL_ICONS } from "@/constants/journal";
import {
  FREE_ENTRY_LIMIT,
  FREE_ICON_COUNT,
  FREE_JOURNAL_LIMIT,
  PRO_FIELD_TYPES,
} from "@/constants/purchases";
import { countEntries } from "@/db/queries/entries";
import { countJournals } from "@/db/queries/journals";
import { type FieldDraftObj, type JournalMetaObj } from "@/utils/journal/journal-field";
import { getSubscriptionSnapshot } from "@/utils/purchases/subscription-store";

/**
 * 無料プランで Pro 限定の操作を実行しようとしたときのエラー
 */
export class ProRequiredError extends Error {
  constructor() {
    super("pro required");
    this.name = "ProRequiredError";
  }
}

/** 無料プランで選べるアイコン（JOURNAL_ICONS の先頭から） */
const FREE_ICONS: readonly SFSymbol[] = JOURNAL_ICONS.slice(0, FREE_ICON_COUNT);

/**
 * 無料プランで選べるアイコンかどうか
 * @param icon アイコン名
 */
export const isFreeIcon = (icon: SFSymbol): boolean => FREE_ICONS.includes(icon);

/**
 * Pro 限定のフィールド種別かどうか
 * @param type フィールド種別
 */
export const isProFieldType = (type: FieldType): boolean => PRO_FIELD_TYPES.includes(type);

/**
 * 無料プランのジャーナル数上限に達しているか
 */
export const isJournalLimitReached = (): boolean =>
  !getSubscriptionSnapshot().isPro && countJournals() >= FREE_JOURNAL_LIMIT;

/**
 * 無料プランのエントリー数上限に達しているか
 * @param journalId ジャーナルID
 */
export const isEntryLimitReached = (journalId: string): boolean =>
  !getSubscriptionSnapshot().isPro && countEntries(journalId) >= FREE_ENTRY_LIMIT;

/**
 * 無料プランで使えないジャーナル設定が含まれていれば ProRequiredError を投げる
 *
 * 編集時は保存済みの設定を base に渡す。作成時点で有効だった Pro 設定は解約後もそのまま使える
 * @param meta ジャーナルのメタ情報
 * @param fields フィールド一覧
 * @param base 保存済みのメタ情報とフィールド（編集時）
 */
export const assertJournalFeatures = (
  meta: JournalMetaObj,
  fields: FieldDraftObj[],
  base?: { meta: JournalMetaObj; fields: FieldDraftObj[] },
): void => {
  if (getSubscriptionSnapshot().isPro) return;

  const baseFieldIds = new Set(base?.fields.map((f) => f.id));

  const requiresPro =
    (meta.oneEntry && !base?.meta.oneEntry) ||
    (meta.locked && !base?.meta.locked) ||
    (!isFreeIcon(meta.icon) && meta.icon !== base?.meta.icon) ||
    fields.some((f) => isProFieldType(f.type) && !baseFieldIds.has(f.id));

  if (requiresPro) throw new ProRequiredError();
};
