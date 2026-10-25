import { z } from "zod";

// TODO: 公開先が決まったら .env.local に実際の URL を設定する（App Store 審査で必須）
const FALLBACK_TERMS_URL = "https://example.com/nicky/terms";
const FALLBACK_PRIVACY_URL = "https://example.com/nicky/privacy";

/** URL として不正・未設定の場合はフォールバック値を使う */
const envUrl = (value: string | undefined, fallback: string) =>
  z.url().catch(fallback).parse(value);

/** 利用規約の URL */
export const TERMS_URL = envUrl(process.env.EXPO_PUBLIC_TERMS_URL, FALLBACK_TERMS_URL);

/** プライバシーポリシーの URL */
export const PRIVACY_URL = envUrl(process.env.EXPO_PUBLIC_PRIVACY_URL, FALLBACK_PRIVACY_URL);
