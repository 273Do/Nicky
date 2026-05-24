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
import { chartTimeScatterFormat } from "@/utils/insights/chart-format";

import { FieldValueEntry } from "./stat-filed-item";

type Props = {
  label: string;
  accentColor: string;
  fieldValues: FieldValueEntry[];
};

/**
 * ステータスカード - 時刻（平均時刻 + 散布図）
 */
export function StatCardTime({ label, accentColor, fieldValues }: Props) {
  const filled = fieldValues.filter((fv) => fv.value !== null);
  const avgTime = (() => {
    if (filled.length === 0) return "--:--";
    const avgMs =
      filled.reduce((sum, fv) => sum + Number(fv.value ?? "0"), 0) /
      filled.length;
    const date = new Date(avgMs);
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  })();

  const chartData = chartTimeScatterFormat(fieldValues, accentColor);

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
            systemName={FIELD_ICONS["time"]}
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
              {avgTime}
            </Text>
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
