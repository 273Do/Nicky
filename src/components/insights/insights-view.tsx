import { useState } from "react";
import { PlatformColor, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import {
  frame,
  listRowBackground,
  listStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getJournalsQuery } from "@/db/queries/journals";

import { JournalChipList } from "./journal-chip";
import { StatsList } from "./stats-list";

/**
 * インサイト画面
 */
export function InsightsView() {
  const { data: journals } = useLiveQuery(getJournalsQuery);

  const [activeJournal, setActiveJournal] = useState<string>("");
  const activeJournalId = activeJournal || (journals[0]?.id ?? "");

  if (journals.length === 0) return null;

  const activeJournalData = journals.find((j) => j.id === activeJournalId);
  const accentColor =
    activeJournalData?.color ?? PlatformColor("systemIndigo").toString();

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{
          flex: 1,
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
              <JournalChipList
                journals={journals}
                activeJournalId={activeJournalId}
                onSelect={(id) => setActiveJournal(id)}
              />
            }
            modifiers={[
              listRowBackground(PlatformColor("systemGroupedBackground")),
            ]}
          >
            <StatsList
              activeJournalId={activeJournalId}
              accentColor={accentColor}
            />
          </Section>
        </List>
      </Host>
    </View>
  );
}
