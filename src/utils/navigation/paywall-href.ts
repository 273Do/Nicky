/** ペイウォールを持つタブ */
export type PaywallTab = "journal" | "template";

/**
 * タブ内のペイウォール画面のパス
 * @param tab ペイウォールを開くタブ
 */
export const paywallHref = (tab: PaywallTab) =>
  tab === "template" ? ("/template/paywall" as const) : ("/(journal)/paywall" as const);
