import { Stack } from "expo-router";

export default function JournalLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBackButtonDisplayMode: "minimal",
      }}
    />
  );
}
