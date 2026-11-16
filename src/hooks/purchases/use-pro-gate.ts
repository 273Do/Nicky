import { useRouter, useSegments } from "expo-router";

import { useSubscription } from "@/hooks/purchases/use-subscription";
import { paywallHref } from "@/utils/navigation/paywall-href";

/**
 * Pro 限定機能のゲート
 */
export const useProGate = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isPro, loading } = useSubscription();

  // タブが切り替わらないよう、表示中のタブ内のペイウォールを開く
  const openPaywall = () =>
    router.navigate(paywallHref(segments[0] === "template" ? "template" : "journal"));

  return { isPro, loading, openPaywall };
};
