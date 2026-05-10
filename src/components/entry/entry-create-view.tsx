import { PlatformColor, View } from "react-native";

import {
  Host,
  List,
  Section,
  Text,
  TextField,
  VStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  listStyle,
} from "@expo/ui/swift-ui/modifiers";

import { formatDate } from "@/utils/date";

/**
 * エントリー作成画面
 */
export function EntryCreateView() {
  const now = Date.now();

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
            listStyle("plain"),
          ]}
        >
          <Section title={formatDate(now)}>
            <VStack alignment="leading" spacing={4}>
              <Text
                modifiers={[
                  font({ size: 12 }),
                  foregroundStyle({
                    type: "hierarchical",
                    style: "secondary",
                  }),
                ]}
              >
                hogehoge
              </Text>

              <TextField
                placeholder="fugafuga"
                modifiers={[frame({ maxWidth: 9999 })]}
              />
            </VStack>
          </Section>
        </List>
      </Host>
    </View>
  );
}
