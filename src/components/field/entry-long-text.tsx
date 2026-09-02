import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type LayoutChangeEvent, PlatformColor, StyleSheet, View } from "react-native";

import { Button, HStack, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import Markdown from "@ronradtke/react-native-markdown-display";

import { FieldWrapper } from "./field-wrapper";
import { MarkdownEditor, calcHeight } from "./markdown-editor";

type Props = {
  /** フィールドラベル */
  label: string;
  /** デフォルト値 */
  defaultValue?: string;
  /** 値変更時のコールバック */
  onValueChange?: (value: string) => void | Promise<void>;
  /** 入力かどうか */
  edit?: boolean;
};

const MIN_HEIGHT = 120;

const markdownStyle = {
  body: { color: PlatformColor("label"), fontSize: 16 },
  heading1: { color: PlatformColor("label") },
  heading2: { color: PlatformColor("label") },
  heading3: { color: PlatformColor("label") },
  code_inline: { color: PlatformColor("label"), backgroundColor: PlatformColor("systemGray5") },
  fence: { color: PlatformColor("label"), backgroundColor: PlatformColor("systemGray5") },
  link: { color: PlatformColor("link") },
};

/**
 * Markdown プレビュー
 */
function MarkdownPreview({ text }: { text: string }) {
  const [contentHeight, setContentHeight] = useState<number>(MIN_HEIGHT);

  const onLayout = (e: LayoutChangeEvent) => {
    setContentHeight(Math.max(MIN_HEIGHT, e.nativeEvent.layout.height));
  };

  return (
    <VStack modifiers={[frame({ height: contentHeight, maxWidth: 9999 })]}>
      <View onLayout={onLayout} style={styles.previewContainer}>
        <Markdown style={markdownStyle}>{text}</Markdown>
      </View>
    </VStack>
  );
}

/**
 * ロングテキストフィールド（Markdown 対応）
 */
export function EntryLongText({ label, defaultValue = "", onValueChange, edit = false }: Props) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(false);
  const [editorHeight, setEditorHeight] = useState(() => calcHeight(defaultValue));
  const [currentText, setCurrentText] = useState(defaultValue);

  const handleValueChange = async (value: string) => {
    setCurrentText(value);
    await onValueChange?.(value);
  };

  if (!edit) {
    return (
      <FieldWrapper label={label}>
        <MarkdownPreview text={defaultValue} />
      </FieldWrapper>
    );
  }

  return (
    <VStack alignment="leading" spacing={4}>
      <HStack>
        <Text
          modifiers={[
            font({ size: 14, weight: "bold" }),
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
          ]}
        >
          {label}
        </Text>
        <Spacer />
        <Button
          onPress={() => setPreview((p) => !p)}
          modifiers={[buttonStyle("bordered"), controlSize("small")]}
        >
          <Text>{preview ? t("field.edit") : t("field.preview")}</Text>
        </Button>
      </HStack>
      {preview ? (
        <MarkdownPreview text={currentText} />
      ) : (
        <VStack modifiers={[frame({ height: editorHeight, maxWidth: 9999 })]}>
          <MarkdownEditor
            placeholder={t("field.longText")}
            defaultValue={defaultValue}
            onValueChange={handleValueChange}
            onHeightChange={setEditorHeight}
          />
        </VStack>
      )}
    </VStack>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: "100%",
  },
});
