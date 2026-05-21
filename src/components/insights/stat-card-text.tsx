import { PlatformColor } from "react-native";

import {
  Chart,
  HStack,
  Image,
  RoundedRectangle,
  Spacer,
  Text,
  VStack,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  background,
  font,
  foregroundStyle,
  frame,
  listRowBackground,
  listRowInsets,
  listRowSeparator,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { FIELD_ICONS } from "@/core/constants";
import { chartFieldValueFormat } from "@/utils/insights/chart-format";

import { FieldValueEntry } from "./stat-filed-item";

type Props = {
  /** ラベル */
  label: string;
  /** アクセントカラー */
  accentColor: string;
  /** フィールド値一覧 */
  fieldValues: FieldValueEntry[];
};

/**
 * ステータスカード - テキスト（平均文字数 + 折れ線グラフ）
 */
export function StatCardText({ label, accentColor, fieldValues }: Props) {
  const avgCharCount =
    fieldValues.length > 0
      ? Math.round(
          fieldValues.reduce((sum, fv) => sum + (fv.value?.length ?? 0), 0) /
            fieldValues.length,
        )
      : 0;

  const chartData = chartFieldValueFormat(fieldValues, accentColor);

  return (
    <ZStack
      alignment="topLeading"
      modifiers={[
        frame({ maxWidth: 9999, height: 140 }),
        listRowSeparator("hidden"),
        listRowInsets({ top: 4, bottom: 6, leading: 16, trailing: 16 }),
        listRowBackground(PlatformColor("systemGroupedBackground")),
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
            systemName={FIELD_ICONS["text"]}
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
        <HStack alignment="bottom">
          <VStack alignment="leading" spacing={2}>
            <Text
              modifiers={[
                font({ size: 12 }),
                foregroundStyle({ type: "hierarchical", style: "secondary" }),
              ]}
            >
              avg
            </Text>
            <HStack spacing={3} alignment="lastTextBaseline">
              <Text modifiers={[font({ size: 28, weight: "semibold" })]}>
                {avgCharCount}
              </Text>
              <Text
                modifiers={[
                  font({ size: 14 }),
                  foregroundStyle({ type: "hierarchical", style: "secondary" }),
                ]}
              >
                chars
              </Text>
            </HStack>
          </VStack>
          <Spacer />
          <Chart
            data={chartData}
            type="bar"
            animate
            showGrid={false}
            modifiers={[
              frame({ width: 90, height: 72 }),
              background(PlatformColor("systemGroupedBackground")),
            ]}
          />
        </HStack>
      </VStack>
    </ZStack>
  );
}
