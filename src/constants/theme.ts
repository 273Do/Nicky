/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";
import { MarkdownStyle } from "react-native-enriched-markdown";

export const Colors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/** systemIndigo カラー */
export const SystemIndigo = {
  light: "#5856D6",
  dark: "#5E5CE6",
} as const;

/** EnrichedMarkdownText 用スタイル */
const buildMarkdownStyle = (
  textColor: string,
  linkColor: string,
  codeBg: string,
): MarkdownStyle => {
  const c = { color: textColor };
  return {
    paragraph: c,
    h1: c,
    h2: c,
    h3: c,
    h4: c,
    h5: c,
    h6: c,
    blockquote: { color: textColor, borderColor: textColor },
    list: c,
    codeBlock: { color: textColor, backgroundColor: codeBg },
    link: { color: linkColor },
    strong: { color: textColor },
    em: { color: textColor },
    strikethrough: { color: textColor },
    underline: { color: textColor },
    code: { color: textColor, backgroundColor: codeBg },
    thematicBreak: { color: textColor },
    table: { color: textColor },
    math: { color: textColor },
    inlineMath: { color: textColor },
    spoiler: { color: textColor },
    highlight: { color: textColor },
  } as const;
};

export const MarkdownStyles = {
  light: buildMarkdownStyle(Colors.light.text, SystemIndigo.light, Colors.light.backgroundElement),
  dark: buildMarkdownStyle(Colors.dark.text, SystemIndigo.dark, Colors.dark.backgroundElement),
} as const;
