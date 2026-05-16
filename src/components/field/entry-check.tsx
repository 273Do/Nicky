import { useState } from "react";
import { PlatformColor } from "react-native";

import { Button, HStack, Image, Text } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  contentShape,
  foregroundStyle,
  frame,
  shapes,
} from "@expo/ui/swift-ui/modifiers";

type Props = {
  /** フィールドラベル */
  label: string;
  /** デフォルト値 */
  defaultValue?: boolean;
  /** 値変更時のコールバック */
  onValueChange?: (value: boolean) => void | Promise<void>;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * チェックフィールド
 */
export function EntryCheck({
  label,
  defaultValue = false,
  onValueChange,
  edit = false,
}: Props) {
  const [check, setCheck] = useState<boolean>(defaultValue);

  const handlePress = () => {
    if (!edit) return;
    const next = !check;
    setCheck(next);
    onValueChange?.(next);
  };

  return (
    <Button
      modifiers={[
        foregroundStyle({ type: "hierarchical", style: "primary" }),
        buttonStyle("plain"),
        frame({ maxWidth: 9999, alignment: "leading" }),
        contentShape(shapes.rectangle()),
      ]}
      onPress={handlePress}
    >
      <HStack spacing={12}>
        <Image
          systemName={check ? "checkmark.circle.fill" : "circle"}
          color={
            check
              ? PlatformColor("systemIndigo")
              : PlatformColor("tertiaryLabel")
          }
          size={22}
        />
        <Text
          modifiers={[
            foregroundStyle({
              type: "hierarchical",
              style: check ? "primary" : "secondary",
            }),
          ]}
        >
          {label}
        </Text>
      </HStack>
    </Button>
  );
}
