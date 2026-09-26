import { useSyncExternalStore } from "react";

import {
  getOfferingsSnapshot,
  loadOfferings,
  subscribeOfferings,
} from "@/utils/purchases/offerings-store";

/**
 * 販売中のサブスクリプションパッケージを取得するフック
 * @returns
 * - monthly 月額パッケージ（未取得なら null）
 * - annual 年額パッケージ（未取得なら null）
 * - loading 取得中かどうか
 * - failed 取得に失敗した、または販売中の商品が 0 件
 * - reload 再取得する関数
 */
export const useOfferings = () => {
  const { monthly, annual, loading, failed } = useSyncExternalStore(
    subscribeOfferings,
    getOfferingsSnapshot,
    getOfferingsSnapshot,
  );

  return { monthly, annual, loading, failed, reload: loadOfferings };
};
