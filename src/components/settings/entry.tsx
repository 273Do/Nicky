import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { Button, Section, Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import { exportAllJournals } from "@/utils/journal/export-journal";

/**
 * エントリーデータの設定セクション
 */
export function EntrySettings() {
  const { t } = useTranslation();

  return (
    <Section>
      <Button
        onPress={async () => await exportAllJournals()}
        modifiers={[foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") })]}
      >
        <Text>{t("settings.exportAllJournals")}</Text>
      </Button>
      <Button
        modifiers={[foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") })]}
      >
        <Text>{t("settings.exportAllEntries")}</Text>
      </Button>
      <Button role="destructive">
        <Text>{t("settings.deleteAllData")}</Text>
      </Button>
    </Section>
  );
}
