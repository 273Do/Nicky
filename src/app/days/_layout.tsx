import { useColorScheme } from "react-native";

import { Stack } from "expo-router";

export default function DaysLayout() {
  const colorScheme = useColorScheme();
  const titleColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitleStyle: {
          color: titleColor,
        },
        headerBackButtonDisplayMode: "minimal",
      }}
    />
  );
}
