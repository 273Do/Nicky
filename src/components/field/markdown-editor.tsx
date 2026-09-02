import type { MarkdownRange } from "@expensify/react-native-live-markdown/src/commonTypes";

import { useRef, useState } from "react";
import { PlatformColor, StyleSheet } from "react-native";

import MarkdownTextInput from "@expensify/react-native-live-markdown/src/MarkdownTextInput";

const MIN_HEIGHT = 120;
const LINE_HEIGHT = 24;

type Props = {
  /** プレースホルダー */
  placeholder?: string;
  /** デフォルト値 */
  defaultValue?: string;
  /** 値変更時のコールバック */
  onValueChange?: (value: string) => void;
  /** 高さ変更時のコールバック */
  onHeightChange?: (height: number) => void;
};

/**
 * Markdown テキストをパースしてレンジ配列を返す
 */
const parseMarkdown = (text: string): MarkdownRange[] => {
  "worklet";
  const ranges: MarkdownRange[] = [];

  const patterns: { regex: RegExp; type: MarkdownRange["type"] }[] = [
    { regex: /\*\*(.+?)\*\*/g, type: "bold" },
    { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, type: "italic" },
    { regex: /~~(.+?)~~/g, type: "strikethrough" },
    { regex: /`([^`]+)`/g, type: "code" },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: "link" },
  ];

  for (const { regex, type } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      ranges.push({ type, start: match.index, length: match[0].length });
    }
  }

  return ranges;
};

export const calcHeight = (text: string): number => {
  const lines = text.split("\n").length;
  return Math.max(MIN_HEIGHT, lines * LINE_HEIGHT);
};

/**
 * ライブフォーマット付き Markdown エディター
 * コンテンツ量に応じて高さが伸びる
 */
export function MarkdownEditor({
  placeholder,
  defaultValue = "",
  onValueChange,
  onHeightChange,
}: Props) {
  const [height, setHeight] = useState(() => calcHeight(defaultValue));
  const textRef = useRef(defaultValue);

  const handleChangeText = (text: string) => {
    textRef.current = text;
    const newHeight = calcHeight(text);
    setHeight(newHeight);
    onHeightChange?.(newHeight);
    onValueChange?.(text);
  };

  return (
    <MarkdownTextInput
      defaultValue={defaultValue}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      placeholderTextColor={PlatformColor("placeholderText")}
      parser={parseMarkdown}
      multiline
      scrollEnabled={false}
      textAlignVertical="top"
      style={[styles.editor, { height }]}
    />
  );
}

const styles = StyleSheet.create({
  editor: {
    minHeight: MIN_HEIGHT,
    width: "100%",
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    color: PlatformColor("label"),
  },
});
