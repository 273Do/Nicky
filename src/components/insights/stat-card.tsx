import { PlatformColor } from "react-native";

import {
  HStack,
  RoundedRectangle,
  Text,
  VStack,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers";

type Props = {
  /** ラベル */
  label: string;
  /** 値 */
  value: string;
  /** 単位 */
  unit: string;
  /** アクセントカラー */
  accentColor: string;
};

/**
 * ステータスカード
 */
export function StatCard({ label, value, unit, accentColor }: Props) {
  return (
    <ZStack
      alignment="topLeading"
      modifiers={[frame({ maxWidth: 9999, height: 100 })]}
    >
      <RoundedRectangle
        cornerRadius={28}
        modifiers={[
          frame({ maxWidth: 9999, maxHeight: 9999 }),
          foregroundStyle(PlatformColor("secondarySystemGroupedBackground")),
        ]}
      />
      <VStack
        alignment="leading"
        spacing={12}
        modifiers={[padding({ horizontal: 16, vertical: 16 })]}
      >
        <Text
          modifiers={[
            font({ size: 15, weight: "bold" }),
            foregroundStyle(accentColor),
          ]}
        >
          {label}
        </Text>
        <HStack spacing={3} alignment="lastTextBaseline">
          <Text modifiers={[font({ size: 28, weight: "semibold" })]}>
            {value}
          </Text>
          <Text
            modifiers={[
              font({ size: 14 }),
              foregroundStyle({ type: "hierarchical", style: "secondary" }),
            ]}
          >
            {unit}
          </Text>
        </HStack>
      </VStack>
    </ZStack>
  );
}
