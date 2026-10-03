import Purchases, { type PurchasesOffering, type PurchasesPackage } from "react-native-purchases";

import { PLANS, type PlanKey } from "@/constants/purchases";
import { REVENUECAT_API_KEY } from "@/utils/purchases/api-key";

/** 販売中のパッケージのスナップショット */
export type OfferingsSnapshot = {
  /** 月額パッケージ */
  monthly: PurchasesPackage | null;
  /** 年額パッケージ */
  annual: PurchasesPackage | null;
  /** 取得中かどうか */
  loading: boolean;
  /** 取得に失敗した、または販売中の商品が 0 件 */
  failed: boolean;
};

const EMPTY: OfferingsSnapshot = { monthly: null, annual: null, loading: false, failed: true };

let snapshot: OfferingsSnapshot = { monthly: null, annual: null, loading: true, failed: false };
const listeners = new Set<() => void>();
let started = false;

const setSnapshot = (next: OfferingsSnapshot) => {
  snapshot = next;
  listeners.forEach((listener) => listener());
};

/**
 * オファリングから指定プランのパッケージを探す
 *
 * ダッシュボードのパッケージ識別子を優先し、見つからなければ期間の種別で探す。
 * @param offering 現在のオファリング
 * @param plan プランの種類
 */
const findPackage = (offering: PurchasesOffering, plan: PlanKey): PurchasesPackage | null => {
  const { identifier, packageType } = PLANS[plan];
  return (
    offering.availablePackages.find((p) => p.identifier === identifier) ??
    offering.availablePackages.find((p) => p.packageType === packageType) ??
    null
  );
};

/**
 * 販売中のパッケージを取得してスナップショットを更新する
 */
export const loadOfferings = async () => {
  if (!REVENUECAT_API_KEY) {
    setSnapshot(EMPTY);
    return;
  }

  setSnapshot({ ...snapshot, loading: true, failed: false });

  try {
    const current = (await Purchases.getOfferings()).current;
    if (!current) {
      setSnapshot(EMPTY);
      return;
    }

    const monthly = findPackage(current, "monthly");
    const annual = findPackage(current, "yearly");
    setSnapshot({ monthly, annual, loading: false, failed: !monthly && !annual });
  } catch (e) {
    console.warn("[purchases]", e);
    setSnapshot(EMPTY);
  }
};

/**
 * 販売中のパッケージの変更を監視する
 * @param listener 変更通知コールバック
 */
export const subscribeOfferings = (listener: () => void) => {
  listeners.add(listener);

  // 最初の購読者がついた時点で 1 回だけ取得する
  if (!started) {
    started = true;
    void loadOfferings();
  }

  return () => {
    listeners.delete(listener);
  };
};

/**
 * 現在の販売中パッケージのスナップショットを返す
 */
export const getOfferingsSnapshot = (): OfferingsSnapshot => snapshot;
