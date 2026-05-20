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

import { chartDateFormat } from "@/utils/date";

type Props = {
  /** 1週間分のエントリーの作成日時（unix ms） */
  timestamps: number[];
  /** ジャーナルカラー */
  accentColor: string;
};

/**
 * 週間まとめカード（横軸: 曜日、縦軸: 時刻）
 */
export function WeeklySummaryCard({ timestamps, accentColor }: Props) {
  const chartData = chartDateFormat(timestamps, accentColor);

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
        spacing={12}
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
            Weekly Summary
          </Text>
        </HStack>
        <Spacer />
        <HStack alignment="bottom">
          <HStack spacing={3} alignment="lastTextBaseline">
            <Text modifiers={[font({ size: 28, weight: "semibold" })]}>
              {timestamps.length}
            </Text>
            <Text
              modifiers={[
                font({ size: 14 }),
                foregroundStyle({ type: "hierarchical", style: "secondary" }),
              ]}
            >
              件 / 週
            </Text>
          </HStack>
          <Spacer />
          <Chart
            data={chartData}
            type="point"
            animate
            showGrid={false}
            pointStyle={{ pointSize: 36 }}
            modifiers={[
              frame({ width: 90, height: 80 }),
              padding({ bottom: -16 }),
            ]}
          />
        </HStack>
      </VStack>
    </ZStack>
  );
}
