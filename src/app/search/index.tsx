import { Stack } from "expo-router";

/**
 * 検索画面
 */
export default function SearchScreen() {
  return (
    <Stack.Screen
      options={{
        title: "Search",
        headerLargeTitleEnabled: true,
        headerSearchBarOptions: {
          placeholder: "Search",
          hideWhenScrolling: false,
        },
      }}
    />
  );
}
