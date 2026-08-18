import { useTranslation } from "react-i18next";
import { Linking, PlatformColor } from "react-native";

import { Button, DatePicker, HStack, Section, Spacer, Text, Toggle } from "@expo/ui/swift-ui";
import { foregroundStyle, tint } from "@expo/ui/swift-ui/modifiers";

import { useAIReflectionSettings } from "@/hooks/settings/use-ai-reflection-settings";

/**
 * アプリの機能設定
 */
export function Application() {
  const { t } = useTranslation();
  const { aiReflectionEnabled, reflectionTime, setAIReflectionEnabled, setReflectionTime } =
    useAIReflectionSettings();

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
        isOn={true}
        label={t("settings.notification")}
        modifiers={[tint(PlatformColor("systemIndigo"))]}
      />
      <Toggle
        isOn={aiReflectionEnabled}
        onIsOnChange={(enabled) => setAIReflectionEnabled(enabled)}
        label={t("settings.aiReflection")}
        modifiers={[tint(PlatformColor("systemIndigo"))]}
      />
      <DatePicker
        title={t("settings.reflectionTime")}
        displayedComponents={["hourAndMinute"]}
        selection={reflectionTime}
        onDateChange={setReflectionTime}
      />
    </Section>
  );
}
