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
  font,
  foregroundStyle,
  frame,
  listRowBackground,
  listRowInsets,
  listRowSeparator,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { FIELD_ICONS } from "@/core/constants";
import { chartNumberFormat } from "@/utils/insights/chart-format";

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
 * ステータスカード - 数値（平均値 + 棒グラフ）
 */
export function StatCardNumber({ label, accentColor, fieldValues }: Props) {
  const filled = fieldValues.filter((fv) => fv.value !== null);
  const avg =
    filled.length > 0
      ? filled.reduce((sum, fv) => sum + Number(fv.value ?? "0"), 0) /
        filled.length
      : 0;
  const avgDisplay = Number.isInteger(avg) ? String(avg) : avg.toFixed(1);

  const chartData = chartNumberFormat(fieldValues, accentColor);

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
        spacing={16}
        modifiers={[padding({ horizontal: 16, vertical: 16 })]}
      >
        <HStack spacing={6}>
          <Image
            systemName={FIELD_ICONS["number"]}
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
        <HStack alignment="lastTextBaseline">
          <VStack alignment="leading" spacing={2}>
            <Text
              modifiers={[
                font({ size: 12 }),
                foregroundStyle({ type: "hierarchical", style: "secondary" }),
              ]}
            >
              avg
            </Text>
            <Text modifiers={[font({ size: 28, weight: "semibold" })]}>
              {avgDisplay}
            </Text>
          </VStack>
          <Spacer />
          <Chart
            data={chartData}
            type="bar"
            animate
            showGrid={false}
            barStyle={{ cornerRadius: 3 }}
            modifiers={[frame({ width: 90, height: 64 })]}
          />
        </HStack>
      </VStack>
    </ZStack>
  );
}
