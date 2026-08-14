import { useState } from "react";
import { PlatformColor } from "react-native";

import { DatePicker, Picker, Section, Text, Toggle } from "@expo/ui/swift-ui";
import { tag, tint } from "@expo/ui/swift-ui/modifiers";

const MODELS = [
  { id: "gemma-3-4b", label: "Gemma 3 4B" },
  { id: "qwen-3-4b", label: "Qwen 3 4B" },
  { id: "phi-4-Mini", label: "Phi-4 Mini" },
] as const;
export function Application() {
  const [selectedModel, setSelectedModel] = useState<(typeof MODELS)[number]["id"]>("gemma-3-4b");

  return (
    <Section>
      <Toggle isOn={true} label="Notification" modifiers={[tint(PlatformColor("systemIndigo"))]} />
      <Toggle isOn={true} label="AI Reflection" modifiers={[tint(PlatformColor("systemIndigo"))]} />
      <DatePicker title="Time" displayedComponents={["hourAndMinute"]} />
      <Picker label="Model" selection={selectedModel} onSelectionChange={setSelectedModel}>
        {MODELS.map((model) => (
          <Text key={model.id} modifiers={[tag(model.id)]}>
            {model.label}
          </Text>
        ))}
      </Picker>
    </Section>
  );
}
