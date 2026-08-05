import { Stack } from "expo-router";

/**
 * インサイト画面
 */
export default function InsightsScreen() {
  return (
    <Stack.Screen
      options={{
        title: "Insights",
        headerLargeTitleEnabled: true,
      }}
    />
  );
}
