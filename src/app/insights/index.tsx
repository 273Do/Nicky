import { Stack } from "expo-router";

import { InsightsView } from "@/components/insights/insights-view";

/**
 * インサイト画面
 */
export default function InsightsScreen() {
  // const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Insights",
          headerLargeTitleEnabled: true,
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: "Create New Journal",
              icon: { type: "sfSymbol", name: "gearshape" },
              // onPress: () => router.push("/(journal)/create"),
              onPress: () => console.log("test"),
            },
          ],
        }}
      />
      <InsightsView />
    </>
  );
}
