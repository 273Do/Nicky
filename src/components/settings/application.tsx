import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, PlatformColor } from "react-native";

import { DatePicker, Picker, Section, Text, Toggle } from "@expo/ui/swift-ui";
import { disabled, tag, tint } from "@expo/ui/swift-ui/modifiers";
import { downloadModel, removeModel } from "@react-native-ai/llama";

import { AI_MODELS, type AIModelId } from "@/constants/ai-models";
import { useAIReflectionSettings } from "@/hooks/settings/use-ai-reflection-settings";

/**
 * アプリの機能設定
 */
export function Application() {
  const { t } = useTranslation();
  const {
    aiReflectionEnabled,
    aiModel,
    reflectionTime,
    setAIReflectionEnabled,
    setAIModel,
    setReflectionTime,
  } = useAIReflectionSettings();
  const [downloading, setDownloading] = useState(false);
  const [pendingModelId, setPendingModelId] = useState<AIModelId | null>(null);
  const displayModelId = pendingModelId ?? aiModel.id;

  const handleModelSelect = (id: string) => {
    if (downloading) return;
    const modelId = id as AIModelId;
    if (modelId === aiModel.id) return;

    const newModel = AI_MODELS.find((m) => m.id === modelId);
    if (!newModel) return;

    setPendingModelId(modelId);

    Alert.alert(
      t("settings.downloadModel"),
      t("settings.downloadConfirm", { model: newModel.label }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: () => setPendingModelId(null),
        },
        {
          text: t("common.ok"),
          onPress: async () => {
            setDownloading(true);
            try {
              await downloadModel(newModel.gguf);
              const oldGguf = aiModel.gguf;
              await setAIModel(newModel.id);
              await removeModel(oldGguf).catch(() => {});
            } catch (error) {
              console.warn("[model-switch]", error);
            } finally {
              setPendingModelId(null);
              setDownloading(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <Section>
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
      <Picker
        label={downloading ? t("settings.downloading") : t("settings.model")}
        selection={displayModelId}
        onSelectionChange={handleModelSelect}
        modifiers={[disabled(downloading)]}
      >
        {AI_MODELS.map((model) => (
          <Text key={model.id} modifiers={[tag(model.id)]}>
            {model.label}
          </Text>
        ))}
      </Picker>
      <DatePicker
        title={t("settings.reflectionTime")}
        displayedComponents={["hourAndMinute"]}
        selection={reflectionTime}
        onDateChange={setReflectionTime}
      />
    </Section>
  );
}
