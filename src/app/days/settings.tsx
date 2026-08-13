import { useState } from "react";
import { PlatformColor } from "react-native";

import {
  DatePicker,
  HStack,
  Host,
  List,
  Picker,
  Section,
  Spacer,
  Text,
  Toggle,
} from "@expo/ui/swift-ui";
import { foregroundStyle, frame, padding, tag, tint } from "@expo/ui/swift-ui/modifiers";

const MODELS = [
  { id: "gemma-3-4b", label: "Gemma 3 4B" },
  { id: "qwen-3-4b", label: "Qwen 3 4B" },
  { id: "phi-4-Mini", label: "Phi-4 Mini" },
] as const;

/**
 * Nicky 設定画面
 */
export default function SettingsScreen() {
  const [selectedModel, setSelectedModel] = useState<(typeof MODELS)[number]["id"]>("gemma-3-4b");

  return (
    <Host
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      useViewportSizeMeasurement
    >
      <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
        <Section>
          <HStack>
            <Text>Language</Text>
            <Spacer />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
              日本語
            </Text>
          </HStack>
          <HStack>
            <Text>外観</Text>
            <Spacer />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "secondary" })]}>
              システム
            </Text>
          </HStack>
        </Section>

        <Section>
          <Toggle
            isOn={true}
            label="Notification"
            modifiers={[tint(PlatformColor("systemIndigo"))]}
          />
          <Toggle
            isOn={true}
            label="AI Reflection"
            modifiers={[tint(PlatformColor("systemIndigo"))]}
          />
          <DatePicker title="Time" displayedComponents={["hourAndMinute"]} />
          <Picker label="Model" selection={selectedModel} onSelectionChange={setSelectedModel}>
            {MODELS.map((model) => (
              <Text key={model.id} modifiers={[tag(model.id)]}>
                {model.label}
              </Text>
            ))}
          </Picker>
        </Section>

        <Section>
          <Text>Export Entries</Text>
          <Text>Import Entries</Text>
          <Text modifiers={[foregroundStyle(PlatformColor("systemRed"))]}>Delete All Data</Text>
        </Section>

        <Section footer={<Text modifiers={[padding({ bottom: 10 })]}>Nicky Version 1.0.0</Text>}>
          <Text>支援</Text>
          <Text>App Store で評価</Text>
          <Text>利用規約</Text>
          <Text>プライバシーポリシー</Text>
          <Text>謝辞</Text>
        </Section>
      </List>
    </Host>
  );
}
