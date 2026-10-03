import { useSyncExternalStore } from "react";
import { PlatformColor } from "react-native";

import { Picker, Section, Text } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";

import {
  type DevProOverride,
  getDevProOverride,
  setDevProOverride,
  subscribeSubscription,
} from "@/utils/purchases/subscription-store";

/**
 * 購読状態の上書きセクション（開発ビルドのみ）
 *
 * Pro で作成したデータが解約後にどう振る舞うかを、実際に解約せずに検証する
 */
export function DevSubscription() {
  const override = useSyncExternalStore(
    subscribeSubscription,
    getDevProOverride,
    getDevProOverride,
  );

  return (
    <Section title="Developer: Pro State">
      <Picker
        selection={override}
        onSelectionChange={(value: DevProOverride) => setDevProOverride(value)}
        modifiers={[pickerStyle("segmented"), tint(PlatformColor("systemIndigo"))]}
      >
        <Text modifiers={[tag("none")]}>Actual</Text>
        <Text modifiers={[tag("free")]}>Free</Text>
        <Text modifiers={[tag("pro")]}>Pro</Text>
      </Picker>
    </Section>
  );
}
