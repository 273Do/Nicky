import { useTranslation } from "react-i18next";

import { Stack } from "expo-router";

import { useMainHeaderLeftItems } from "@/hooks/navigation/use-main-header-left-items";

/**
 * テンプレート画面
 */
export default function TemplateScreen() {
  const { t } = useTranslation();
  // const router = useRouter();

  const headerLeftItems = useMainHeaderLeftItems("template");

  // const { isPro, openPaywall } = useProGate();
  // const journalLimitReached = !isPro && journalList.length >= FREE_JOURNAL_LIMIT;

  return (
    <Stack.Screen
      options={{
        title: t("template.title"),
        headerLargeTitleEnabled: true,
        unstable_headerLeftItems: () => headerLeftItems,
        unstable_headerRightItems: () => [
          {
            type: "button",
            label: t("journal.newJournal"),
            icon: { type: "sfSymbol", name: "folder.badge.plus" },
            // onPress: () => (journalLimitReached ? openPaywall() : router.push("/template/create")),
            onPress: () => console.log("test"),
          },
        ],
      }}
    />
  );
}
