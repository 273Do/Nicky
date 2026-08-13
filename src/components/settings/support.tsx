import { Section, Text } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";

export function Support() {
  return (
    <Section footer={<Text modifiers={[padding({ bottom: 10 })]}>Nicky Version 1.0.0</Text>}>
      <Text>支援</Text>
      <Text>App Store で評価</Text>
      <Text>利用規約</Text>
      <Text>プライバシーポリシー</Text>
      <Text>謝辞</Text>
    </Section>
  );
}
