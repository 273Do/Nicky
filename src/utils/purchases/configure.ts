import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

import { REVENUECAT_API_KEY } from "@/utils/purchases/api-key";
import { startSubscriptionSync } from "@/utils/purchases/subscription-store";

let configured = false;

/**
 * RevenueCat SDK を初期化する（モジュール読み込み時に 1 回だけ実行される）
 *
 * - iOS 以外・API キー未設定の場合は何もしない
 * - ログイン機能がないため appUserID は渡さず匿名 ID を使う
 */
const configure = () => {
  // Purchases.isConfigured は Promise を返すメソッドなので、同期フラグで二重実行を防ぐ
  if (configured) return;
  if (Platform.OS !== "ios") return;
  if (!REVENUECAT_API_KEY) {
    console.warn("[purchases]", "EXPO_PUBLIC_REVENUECAT_IOS_KEY が未設定です");
    return;
  }

  configured = true;
  if (__DEV__) void Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  Purchases.configure({ apiKey: REVENUECAT_API_KEY });
  startSubscriptionSync();
};

configure();
