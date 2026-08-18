import { useTranslation } from "react-i18next";

import { Button, Section, Text } from "@expo/ui/swift-ui";
import { foregroundStyle } from "@expo/ui/swift-ui/modifiers";

const primaryStyle = foregroundStyle({ type: "hierarchical", style: "primary" });

export function EntrySettings() {
  const { t } = useTranslation();

  return (
    <Section>
      <Button modifiers={[primaryStyle]}>
        <Text>{t("settings.exportAllJournals")}</Text>
      </Button>
      <Button modifiers={[primaryStyle]}>
        <Text>{t("settings.exportAllEntries")}</Text>
      </Button>
      <Button role="destructive" modifiers={[primaryStyle]}>
        <Text>{t("settings.deleteAllData")}</Text>
      </Button>
    </Section>
  );
}
