import { PlatformColor, View } from "react-native";

import { Host, List, Section, Text } from "@expo/ui/swift-ui";
import { frame, listStyle } from "@expo/ui/swift-ui/modifiers";

type Props = {
  /** エントリーid */
  id: string;
};

/**
 * エントリー詳細画面
 */
export function EntryDetailView({ id }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{
          flex: 1,
          backgroundColor: PlatformColor("systemBackground"),
        }}
        useViewportSizeMeasurement
      >
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            listStyle("insetGrouped"),
          ]}
        >
          <Section>
            <Text>{id}</Text>
            {/* <Text>{title}</Text>
            <Text>{preview}</Text>
            <Text>{bookmark ? "Bookmarked" : "Not bookmarked"}</Text> */}
          </Section>
        </List>
      </Host>
    </View>
  );
}
