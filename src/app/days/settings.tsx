import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { Alert, Button, Host, List, Text } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

import { Application } from "@/components/settings/application";
import { EntrySettings } from "@/components/settings/entry";
import { Support } from "@/components/settings/support";
import { deleteAllData } from "@/db/queries/entries";

/**
 * Nicky 設定画面
 */
export default function SettingsScreen() {
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <Host
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      useViewportSizeMeasurement
    >
      <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
        <Application />
        <EntrySettings setShowDeleteAlert={setShowDeleteAlert} />
        <Support />
      </List>

      <Alert
        title={t("settings.deleteAllDataTitle")}
        isPresented={showDeleteAlert}
        onIsPresentedChange={setShowDeleteAlert}
      >
        <Alert.Trigger>
          <Text>{""}</Text>
        </Alert.Trigger>
        <Alert.Message>
          <Text>{t("settings.deleteAllDataConfirm")}</Text>
        </Alert.Message>
        <Alert.Actions>
          <Button label={t("common.cancel")} role="cancel" />
          <Button
            label={t("common.delete")}
            role="destructive"
            onPress={async () => {
              await deleteAllData().catch(console.error);
            }}
          />
        </Alert.Actions>
      </Alert>
    </Host>
  );
}
