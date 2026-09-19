import {
  PlatformColor,
  StyleSheet,
  TextInput,
  type TextInputContentSizeChangeEvent,
} from "react-native";

const MIN_HEIGHT = 120;

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
 * プレーンテキスト Markdown エディター
 */
export function MarkdownEditor({
  placeholder,
  defaultValue = "",
  onValueChange,
  onHeightChange,
}: Props) {
  const handleContentSizeChange = (e: TextInputContentSizeChangeEvent) => {
    const h = Math.max(MIN_HEIGHT, Math.ceil(e.nativeEvent.contentSize.height));
    onHeightChange?.(h);
  };

  return (
    <TextInput
      defaultValue={defaultValue}
      onChangeText={onValueChange}
      onContentSizeChange={handleContentSizeChange}
      placeholder={placeholder}
      placeholderTextColor={PlatformColor("placeholderText")}
      selectionColor={PlatformColor("systemIndigo")}
      multiline
      scrollEnabled={false}
      textAlignVertical="top"
      style={styles.editor}
    />
  );
}

const styles = StyleSheet.create({
  editor: {
    minHeight: MIN_HEIGHT,
    width: "100%",
    paddingRight: 16,
    fontSize: 16,
    color: PlatformColor("label"),
  },
});
