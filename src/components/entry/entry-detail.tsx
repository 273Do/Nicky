import { PlatformColor, View } from "react-native";

import {
  Host,
  HStack,
  Image,
  List,
  Section,
  Spacer,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  listStyle,
} from "@expo/ui/swift-ui/modifiers";

import { EntryDetailObj } from "@/db/queries/entries";
import { formatDate } from "@/utils/date";

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
            listStyle("plain"),
          ]}
        >
          <Section
            header={
              <HStack>
                <Text>{formatDate(entry.createdAt)}</Text>
                <Spacer />
                {entry.bookmark && (
                  <Image
                    systemName={"bookmark.fill"}
                    color={PlatformColor("systemIndigo")}
                    size={16}
                  />
                )}
              </HStack>
            }
          >
            {sorted.map((v) => (
              <VStack key={v.id} alignment="leading" spacing={4}>
                <Text
                  modifiers={[
                    font({ size: 14, weight: "bold" }),
                    foregroundStyle({
                      type: "hierarchical",
                      style: "secondary",
                    }),
                  ]}
                >
                  {v.field.label}
                </Text>
                <Text modifiers={[font({ size: 16 })]}>{v.value ?? ""}</Text>
              </VStack>
            ))}
          </Section>
        </List>
      </Host>
    </View>
  );
}
