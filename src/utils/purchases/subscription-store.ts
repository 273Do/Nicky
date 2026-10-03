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

/** 開発用の購読状態の上書き（none: RevenueCat の実際の状態を使う） */
export type DevProOverride = "none" | "free" | "pro";

// API キー未設定・非 iOS では初回取得が走らないため、最初から確定状態にする
let actual: SubscriptionSnapshot = REVENUECAT_API_KEY
  ? { isPro: false, loading: true }
  : { isPro: false, loading: false };

let devOverride: DevProOverride = "none";
let snapshot: SubscriptionSnapshot = actual;

const listeners = new Set<() => void>();
let started = false;

// スナップショットは必ず新しいオブジェクトに差し替える
// force: スナップショットが変わらなくても通知する（上書き状態の変更用）
const publish = (force = false) => {
  const next = devOverride === "none" ? actual : { isPro: devOverride === "pro", loading: false };
  const changed = next.isPro !== snapshot.isPro || next.loading !== snapshot.loading;
  if (changed) snapshot = next;
  if (changed || force) listeners.forEach((listener) => listener());
};

const setSnapshot = (next: SubscriptionSnapshot) => {
  actual = next;
  publish();
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

/**
 * 購読状態を上書きする（開発ビルドのみ。解約後の挙動の検証用）
 *
 * アプリの再読み込みで none に戻る
 * @param value 上書きする状態
 */
export const setDevProOverride = (value: DevProOverride) => {
  if (!__DEV__) return;
  devOverride = value;
  publish(true);
};

/**
 * 現在の購読状態の上書きを返す（useSyncExternalStore 用）
 */
export const getDevProOverride = (): DevProOverride => devOverride;
