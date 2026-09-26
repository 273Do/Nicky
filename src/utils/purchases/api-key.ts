import { z } from "zod";

const parsed = z
  .string()
  .min(1)
  .safeParse(
    __DEV__
      ? (process.env.EXPO_PUBLIC_REVENUECAT_IOS_TEST_KEY ??
          process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY)
      : process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  );

/**
 * RevenueCat の公開 API キー
 */
export const REVENUECAT_API_KEY: string | null = parsed.success ? parsed.data : null;
