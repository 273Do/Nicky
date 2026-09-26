import { PACKAGE_TYPE } from "react-native-purchases";

import { z } from "zod";

import { type FieldType } from "@/constants/journal";

/** 未設定・空文字の場合はフォールバック値を使う */
const envId = (value: string | undefined, fallback: string) =>
  z.string().min(1).catch(fallback).parse(value);

/** RevenueCat のエンタイトルメント ID */
export const ENTITLEMENT_ID = envId(process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID, "nicky_pro");

/** RevenueCat のオファリング ID */
export const OFFERING_ID = envId(process.env.EXPO_PUBLIC_REVENUECAT_OFFERING_ID, "default");

/** サブスクリプションのプラン */
export const PLANS = {
  monthly: {
    identifier: envId(process.env.EXPO_PUBLIC_REVENUECAT_MONTHLY_PACKAGE_ID, "monthly"),
    packageType: PACKAGE_TYPE.MONTHLY,
  },
  yearly: {
    identifier: envId(process.env.EXPO_PUBLIC_REVENUECAT_YEARLY_PACKAGE_ID, "yearly"),
    packageType: PACKAGE_TYPE.ANNUAL,
  },
} as const;

/** プランの種類 */
export type PlanKey = keyof typeof PLANS;

/** 無料プランで作成できるジャーナル数 */
export const FREE_JOURNAL_LIMIT = 2;

/** 無料プランでジャーナルごとに作成できるエントリー数 */
export const FREE_ENTRY_LIMIT = 7;

/** 無料プランで選べるジャーナルアイコン数（JOURNAL_ICONS の先頭から） */
export const FREE_ICON_COUNT = 6;

/** Pro 限定のフィールド種別 */
export const PRO_FIELD_TYPES: readonly FieldType[] = ["media", "check", "rating", "location"];
