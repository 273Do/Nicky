import { PlatformColor } from "react-native";

import { Host, List } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

import { Application } from "@/components/settings/application";
import { EntrySettings } from "@/components/settings/entry";
import { Support } from "@/components/settings/support";

/**
 * Nicky 設定画面
 */
export default function SettingsScreen() {
  return (
    <Host
      style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
      useViewportSizeMeasurement
    >
      <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
        <Application />
        <EntrySettings />
        <Support />
      </List>
    </Host>
  );
}
