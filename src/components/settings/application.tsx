import { useState } from "react";
import { Alert, PlatformColor } from "react-native";

import { DatePicker, Picker, Section, Text, Toggle } from "@expo/ui/swift-ui";
import { disabled, tag, tint } from "@expo/ui/swift-ui/modifiers";
import { downloadModel, removeModel } from "@react-native-ai/llama";

import { AI_MODELS, type AIModelId } from "@/constants/ai-models";
import { useAIReflectionSettings } from "@/utils/settings/use-ai-reflection-settings";

/**
 * アプリの機能設定
 */
export function Application() {
  const { aiReflectionEnabled, aiModel, setAIReflectionEnabled, setAIModel } =
    useAIReflectionSettings();
  const [downloading, setDownloading] = useState(false);
  const [displayModelId, setDisplayModelId] = useState<AIModelId>(aiModel.id);

  const handleModelSelect = (id: string) => {
    if (downloading) return;
    const modelId = id as AIModelId;
    if (modelId === aiModel.id) return;

    const newModel = AI_MODELS.find((m) => m.id === modelId);
    if (!newModel) return;

    setDisplayModelId(modelId);

    Alert.alert(
      "Download Model",
      `${newModel.label} をダウンロードしますか？\n現在のモデルは削除されます。`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setDisplayModelId(aiModel.id),
        },
        {
          text: "OK",
          onPress: async () => {
            setDownloading(true);
            try {
              await downloadModel(newModel.gguf);
              const oldGguf = aiModel.gguf;
              await setAIModel(newModel.id);
              await removeModel(oldGguf).catch(() => {});
            } catch (error) {
              console.warn("[model-switch]", error);
              setDisplayModelId(aiModel.id);
            } finally {
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
      <Toggle isOn={true} label="Notification" modifiers={[tint(PlatformColor("systemIndigo"))]} />
      <Toggle
        isOn={aiReflectionEnabled}
        onIsOnChange={(enabled) => setAIReflectionEnabled(enabled)}
        label="AI Reflection"
        modifiers={[tint(PlatformColor("systemIndigo"))]}
      />
      <DatePicker title="Time" displayedComponents={["hourAndMinute"]} />
      <Picker
        label={downloading ? "Downloading..." : "Model"}
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
    </Section>
  );
}
