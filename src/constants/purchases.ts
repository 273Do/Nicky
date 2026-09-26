import { PACKAGE_TYPE } from "react-native-purchases";

/** RevenueCat のエンタイトルメント ID */
export const ENTITLEMENT_ID = "nicky_pro";

/** RevenueCat のオファリング ID */
export const OFFERING_ID = "default";

/** サブスクリプションのプラン */
export const PLANS = {
  monthly: { identifier: "monthly", packageType: PACKAGE_TYPE.MONTHLY },
  yearly: { identifier: "yearly", packageType: PACKAGE_TYPE.ANNUAL },
} as const;

/** プランの種類 */
export type PlanKey = keyof typeof PLANS;
