import { useTranslation } from "react-i18next";
import { Linking, PlatformColor } from "react-native";

import { Button, HStack, Section, Spacer, Text, Toggle } from "@expo/ui/swift-ui";
import { foregroundStyle, tint } from "@expo/ui/swift-ui/modifiers";

import { useNotificationSettings } from "@/hooks/settings/use-notification-settings";

/**
 * アプリの機能設定
 */
export function Application() {
  const { t } = useTranslation();
  const { notificationEnabled, setNotificationEnabled } = useNotificationSettings();

  return (
    <Section>
      <Button
        onPress={() => void Linking.openSettings()}
        modifiers={[foregroundStyle({ type: "color", color: PlatformColor("label") })]}
      >
        <HStack>
          <Text>{t("settings.language")}</Text>
          <Spacer />
          <Text
            modifiers={[foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") })]}
          >
            {t("settings.currentLanguage")}
          </Text>
        </HStack>
      </Button>
      <Toggle
        isOn={notificationEnabled}
        onIsOnChange={setNotificationEnabled}
        label={t("settings.notification")}
        modifiers={[tint(PlatformColor("systemIndigo"))]}
      />
    </Section>
  );
}
