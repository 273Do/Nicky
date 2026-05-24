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
import { chartCheckFormat } from "@/utils/insights/chart-format";

import { FieldValueEntry } from "./stat-filed-item";

type Props = {
  label: string;
  accentColor: string;
  fieldValues: FieldValueEntry[];
};

/**
 * ステータスカード - 日付（記録数 + 棒グラフ）
 */
export function StatCardDate({ label, accentColor, fieldValues }: Props) {
  const totalCount = fieldValues.filter((fv) => fv.value !== null).length;

  // チェックフォーマットを流用（非null = 記録あり で1扱い）
  const filledAsBool = fieldValues.map((fv) => ({
    ...fv,
    value: fv.value !== null ? "true" : "false",
  }));
  const chartData = chartCheckFormat(filledAsBool, accentColor);

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
            systemName={FIELD_ICONS["date"]}
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
              total
            </Text>
            <HStack spacing={3} alignment="lastTextBaseline">
              <Text modifiers={[font({ size: 28, weight: "semibold" })]}>
                {totalCount}
              </Text>
              <Text
                modifiers={[
                  font({ size: 14 }),
                  foregroundStyle({ type: "hierarchical", style: "secondary" }),
                ]}
              >
                entries
              </Text>
            </HStack>
          </VStack>
          <Spacer />
          <Chart
            data={chartData}
            type="point"
            animate
            showGrid={false}
            pointStyle={{ pointSize: 36 }}
            modifiers={[frame({ width: 90, height: 64 })]}
          />
        </HStack>
      </VStack>
    </ZStack>
  );
}
