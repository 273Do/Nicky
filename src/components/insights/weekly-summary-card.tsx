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
  listRowInsets,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { EntryDetailObj } from "@/db/queries/entries";
import { chartDateFormat } from "@/utils/insights/chart-format";

type Props = {
  /** ジャーナルカラー */
  accentColor: string;
  /** エントリー一覧 */
  entries: EntryDetailObj[];
};

/**
 * 週間まとめカード（横軸: 曜日、縦軸: 時刻）
 */
export function WeeklySummaryCard({ accentColor, entries }: Props) {
  const entryTimestamps = entries.map((e) => e.createdAt);

  const { data: chartData, count } = chartDateFormat(
    entryTimestamps,
    accentColor,
  );

  return (
    <ZStack
      alignment="topLeading"
      modifiers={[
        frame({ maxWidth: 9999, height: 140 }),
        listRowInsets({ top: 4, bottom: 4, leading: 16, trailing: 16 }),
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
            systemName="calendar"
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
            Total Entries
          </Text>
        </HStack>
        <HStack alignment="lastTextBaseline">
          <HStack spacing={3} alignment="lastTextBaseline">
            <Text modifiers={[font({ size: 28, weight: "semibold" })]}>
              {count}
            </Text>
            <Text
              modifiers={[
                font({ size: 14 }),
                foregroundStyle({ type: "hierarchical", style: "secondary" }),
              ]}
            >
              entries / wk
            </Text>
          </HStack>
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
