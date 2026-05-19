import { useState } from "react";
import { PlatformColor, View } from "react-native";

import { Host, ScrollView, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getJournalsQuery } from "@/db/queries/journals";

import { JournalChipList } from "./journal-chip";

/**
 * インサイト画面
 */
export function InsightsView() {
  const { data: journals } = useLiveQuery(getJournalsQuery);

  const [activeJournal, setActiveJournal] = useState<string>("");
  const activeJournalId = activeJournal || (journals[0]?.id ?? "");

  if (journals.length === 0) return null;

  console.log(activeJournal);

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <ScrollView>
          <VStack
            alignment="leading"
            spacing={0}
            modifiers={[padding({ top: -32 })]}
          >
            <JournalChipList
              journals={journals}
              activeJournalId={activeJournalId}
              onSelect={(id) => setActiveJournal(id)}
            />

            <VStack modifiers={[padding({ leading: 16, top: -16 })]}>
              <Text>aa</Text>
            </VStack>
            <Spacer />
          </VStack>
        </ScrollView>
      </Host>
    </View>
  );
}
