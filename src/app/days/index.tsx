import { Stack } from "expo-router";

/**
 * インサイト画面
 */
export default function DaysScreen() {
  return (
    <Stack.Screen
      options={{
        title: "Days",
        headerLargeTitleEnabled: true,
      }}
    />
  );
}
