import { type ReactNode } from "react";

import { Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

type Props = {
  /** フィールドラベル */
  label: string;
  /** フィールドのコンテンツ */
  children: ReactNode;
};

/**
 * フィールドコンポーネント共通ラッパー
 */
export function FieldWrapper({ label, children }: Props) {
  return (
    <VStack alignment="leading" spacing={4}>
      <Text
        modifiers={[
          font({ size: 14, weight: "bold" }),
          foregroundStyle({ type: "hierarchical", style: "secondary" }),
        ]}
      >
        {label}
      </Text>
      {children}
    </VStack>
  );
}
