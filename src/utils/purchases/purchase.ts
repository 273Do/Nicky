import { Alert, Linking } from "react-native";
import Purchases, {
  PURCHASES_ERROR_CODE,
  type PurchasesError,
  type PurchasesPackage,
} from "react-native-purchases";

import i18n from "@/i18n";
import { hasProEntitlement } from "@/utils/purchases/subscription-store";

/** App Store のサブスクリプション管理画面 */
const MANAGE_SUBSCRIPTION_URL = "itms-apps://apps.apple.com/account/subscriptions";

/**
 * ユーザーが購入をキャンセルしたかどうかを判定する
 *
 * PurchasesError.userCancelled は非推奨のためエラーコードで判定する。
 * @param e catch したエラー
 */
const isCancelled = (e: unknown) =>
  (e as PurchasesError).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;

/**
 * パッケージを購入する
 * @param pkg 購入対象のパッケージ
 * @returns Pro が有効になった場合 true
 */
export const purchasePackage = async (pkg: PurchasesPackage): Promise<boolean> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return hasProEntitlement(customerInfo);
  } catch (e) {
    // キャンセルはエラーではないので通知しない
    if (isCancelled(e)) return false;
    console.warn("[purchases]", e);
    Alert.alert(i18n.t("error.purchaseFailed"), i18n.t("error.purchaseFailedMessage"));
    return false;
  }
};

/**
 * 過去の購入を復元する
 * @returns Pro が有効になった場合 true
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    return hasProEntitlement(await Purchases.restorePurchases());
  } catch (e) {
    console.warn("[purchases]", e);
    Alert.alert(i18n.t("error.restoreFailed"), i18n.t("error.restoreFailedMessage"));
    return false;
  }
};

/**
 * サブスクリプションの管理画面を開く
 *
 * Test Store では showManageSubscriptions が使えないため App Store の設定画面にフォールバックする。
 */
export const openManageSubscription = async () => {
  try {
    await Purchases.showManageSubscriptions();
  } catch (e) {
    console.warn("[purchases]", e);
    await Linking.openURL(MANAGE_SUBSCRIPTION_URL).catch((error) =>
      console.warn("[purchases]", error),
    );
  }
};
