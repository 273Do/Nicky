import { PlatformColor } from "react-native";

import { Chart, ScrollView, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";

const weeklyData = [
  { x: "Mon", y: 3 },
  { x: "Tue", y: 7 },
  { x: "Wed", y: 2 },
  { x: "Thu", y: 5 },
  { x: "Fri", y: 8 },
  { x: "Sat", y: 4 },
  { x: "Sun", y: 6 },
];

const trendData = [
  { x: 1, y: 12 },
  { x: 2, y: 18 },
  { x: 3, y: 9 },
  { x: 4, y: 24 },
  { x: 5, y: 20 },
  { x: 6, y: 30 },
  { x: 7, y: 27 },
  { x: 8, y: 35 },
];

export default function ChartDemo() {
  return (
    <ScrollView>
      <VStack alignment="leading" spacing={24}>
        {/* 曜日別エントリー数 */}
        <VStack alignment="leading" spacing={8}>
          <Text
            modifiers={[
              font({ size: 17, weight: "semibold" }),
              foregroundStyle({ type: "hierarchical", style: "primary" }),
            ]}
          >
            Entries by Day
          </Text>
          <Chart
            data={weeklyData}
            type="bar"
            animate
            showGrid
            barStyle={{ cornerRadius: 6 }}
            modifiers={[frame({ maxWidth: 9999, height: 200 })]}
          />
        </VStack>

        {/* エントリー推移 */}
        <VStack alignment="leading" spacing={8}>
          <Text
            modifiers={[
              font({ size: 17, weight: "semibold" }),
              foregroundStyle({ type: "hierarchical", style: "primary" }),
            ]}
          >
            Entry Trend
          </Text>
          <Chart
            data={trendData}
            type="area"
            animate
            showGrid
            lineStyle={{ color: PlatformColor("systemIndigo"), width: 2 }}
            areaStyle={{ color: "rgba(88, 86, 214, 0.5)" }}
            modifiers={[frame({ maxWidth: 9999, height: 200 })]}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
