import { useSyncExternalStore } from "react";

import {
  getSubscriptionSnapshot,
  subscribeSubscription,
} from "@/utils/purchases/subscription-store";

/**
 * Nicky Pro の購読状態を購読するフック
 * @returns
 * - isPro nicky_pro エンタイトルメントが有効かどうか
 * - loading 初回の購読状態取得が完了していないあいだ true
 */
export const useSubscription = () => {
  const { isPro, loading } = useSyncExternalStore(
    subscribeSubscription,
    getSubscriptionSnapshot,
    getSubscriptionSnapshot,
  );

  return { isPro, loading };
};
