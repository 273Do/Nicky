import { useRouter } from "expo-router";

import { useSubscription } from "@/hooks/purchases/use-subscription";

/**
 * Pro 限定機能のゲート
 */
export const useProGate = () => {
  const router = useRouter();
  const { isPro, loading } = useSubscription();

  const openPaywall = () => router.navigate("/(journal)/paywall");

  return { isPro, loading, openPaywall };
};
