import { PlatformColor } from "react-native";

import {
  HStack,
  Image,
  RoundedRectangle,
  Spacer,
  Text,
  VStack,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  listRowInsets,
  listRowSeparator,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { FIELD_ICONS, FieldType } from "@/core/constants";

type Props = {
  /** ラベル */
  label: string;
  /** 値 */
  value: string;
  /** 単位 */
  unit: string;
  /** フィールドタイプ */
  fieldType: FieldType;
  /** アクセントカラー */
  accentColor: string;
};

/**
 * ステータスカード
 */
export function StatCard({
  label,
  value,
  unit,
  fieldType,
  accentColor,
}: Props) {
  return (
    <ZStack
      alignment="topLeading"
      modifiers={[
        frame({ maxWidth: 9999, height: 140 }),
        listRowSeparator("hidden"),
        listRowInsets({ top: 4, bottom: 6, leading: 16, trailing: 16 }),
      ]}
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
        <HStack spacing={6}>
          <Image
            systemName={FIELD_ICONS[fieldType]}
            color={accentColor}
            size={20}
            modifiers={[frame({ width: 24 })]}
          />
          <Text
            modifiers={[
              font({ size: 15, weight: "bold" }),
              foregroundStyle(accentColor),
            ]}
          >
            {label}
          </Text>
        </HStack>
        <Spacer />
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
