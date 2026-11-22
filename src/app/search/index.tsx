import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Stack } from "expo-router";

import { SearchResultsView } from "@/components/search/search-results-view";
import { useSearchEntries } from "@/hooks/search/use-search-entries";

/**
 * 検索画面
 */
export default function SearchScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>("");
  const results = useSearchEntries(query);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("search.title"),
          headerLargeTitleEnabled: true,
          headerSearchBarOptions: {
            placeholder: t("search.placeholder"),
            hideWhenScrolling: false,
            autoCapitalize: "none",
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setQuery(""),
          },
        }}
      />
      <SearchResultsView query={query} results={results} />
    </>
  );
}
