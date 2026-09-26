import Purchases, { type CustomerInfo } from "react-native-purchases";

import { ENTITLEMENT_ID } from "@/constants/purchases";
import { REVENUECAT_API_KEY } from "@/utils/purchases/api-key";

/** 購読状態のスナップショット */
export type SubscriptionSnapshot = {
  /** nicky_pro エンタイトルメントが有効かどうか */
  isPro: boolean;
  /** 初回の CustomerInfo 取得が完了していないあいだ true */
  loading: boolean;
};

/**
 * CustomerInfo から nicky_pro エンタイトルメントの有効・無効を判定する
 * @param info RevenueCat の CustomerInfo
 */
export const hasProEntitlement = (info: CustomerInfo): boolean =>
  info.entitlements.active[ENTITLEMENT_ID] !== undefined;

// API キー未設定・非 iOS では初回取得が走らないため、最初から確定状態にする
let snapshot: SubscriptionSnapshot = REVENUECAT_API_KEY
  ? { isPro: false, loading: true }
  : { isPro: false, loading: false };

const listeners = new Set<() => void>();
let started = false;

// スナップショットは必ず新しいオブジェクトに差し替える
const setSnapshot = (next: SubscriptionSnapshot) => {
  if (next.isPro === snapshot.isPro && next.loading === snapshot.loading) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
};

const apply = (info: CustomerInfo) =>
  setSnapshot({ isPro: hasProEntitlement(info), loading: false });

/**
 * CustomerInfo の同期を開始する（SDK の初期化直後に 1 回だけ呼ぶ）
 *
 * - addCustomerInfoUpdateListener で購入・復元・更新・失効を反映する
 * - 初回値は getCustomerInfo() で取得する（キャッシュがあれば即時返る）
 */
export const startSubscriptionSync = () => {
  if (started) return;
  started = true;

  // リスナーはアプリの生存期間中そのまま保持する
  Purchases.addCustomerInfoUpdateListener(apply);

  Purchases.getCustomerInfo()
    .then(apply)
    .catch((e) => {
      console.warn("[purchases]", e);
      setSnapshot({ isPro: false, loading: false });
    });
};

/**
 * 購読状態の変更を監視する（useSyncExternalStore 用）
 * @param listener 変更通知コールバック
 */
export const subscribeSubscription = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * 現在の購読状態スナップショットを返す（useSyncExternalStore 用）
 */
export const getSubscriptionSnapshot = (): SubscriptionSnapshot => snapshot;

/**
 * CustomerInfo を再取得して購読状態を更新する
 */
export const refreshSubscription = async () => {
  try {
    apply(await Purchases.getCustomerInfo());
  } catch (e) {
    console.warn("[purchases]", e);
  }
};
