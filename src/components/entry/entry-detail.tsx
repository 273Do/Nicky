import { PlatformColor, View } from "react-native";

import { Host, List, Section, Text, VStack } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  listStyle,
} from "@expo/ui/swift-ui/modifiers";

import { EntryDetailObj } from "@/db/queries/entries";

type Props = {
  /** エントリーデータ */
  entry: EntryDetailObj;
};
/**
 * エントリー詳細画面
 */
export function EntryDetailView({ entry }: Props) {
  const sorted = [...entry.values].sort(
    (a, b) => a.field.sortOrder - b.field.sortOrder,
  );

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
            {sorted.map((v) => (
              <VStack key={v.id} alignment="leading" spacing={4}>
                <Text
                  modifiers={[
                    font({ size: 12 }),
                    foregroundStyle({
                      type: "hierarchical",
                      style: "secondary",
                    }),
                  ]}
                >
                  {v.field.label}
                </Text>
                <Text>{v.value ?? ""}</Text>
              </VStack>
            ))}
          </Section>
        </List>
      </Host>
    </View>
  );
}
