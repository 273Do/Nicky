import { useTranslation } from "react-i18next";

import { Stack } from "expo-router";

/**
 * 検索画面
 */
export default function SearchScreen() {
  const { t } = useTranslation();

  return (
    <Stack.Screen
      options={{
        title: t("search.title"),
        headerLargeTitleEnabled: true,
        headerSearchBarOptions: {
          placeholder: t("search.placeholder"),
          hideWhenScrolling: false,
        },
      }}
    />
  );
}
