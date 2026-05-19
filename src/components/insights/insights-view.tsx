import { useState } from "react";
import { PlatformColor, View } from "react-native";

import { Host, ScrollView, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, padding } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getJournalsQuery } from "@/db/queries/journals";

import { JournalChipList } from "./journal-chip";
import { StatCard } from "./stat-card";
import { WeeklySummaryCard } from "./weekly-summary-card";

/**
 * インサイト画面
 */
export function InsightsView() {
  const { data: journals } = useLiveQuery(getJournalsQuery);

  const [activeJournal, setActiveJournal] = useState<string>("");
  const activeJournalId = activeJournal || (journals[0]?.id ?? "");

  if (journals.length === 0) return null;

  const activeJournalData = journals.find((j) => j.id === activeJournalId);
  const entryCount = activeJournalData?.entryCount ?? 0;
  const accentColor =
    activeJournalData?.color ?? PlatformColor("systemIndigo").toString();

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{
          flex: 1,
          backgroundColor: PlatformColor("systemGroupedBackground"),
        }}
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

            <VStack
              alignment="leading"
              spacing={12}
              modifiers={[padding({ horizontal: 16, bottom: 16 })]}
            >
              <WeeklySummaryCard
                timestamps={[
                  Date.UTC(2026, 4, 14, 10, 0), // 木: 1件
                  Date.UTC(2026, 4, 15, 8, 30), // 金: 2件
                  Date.UTC(2026, 4, 15, 20, 0),
                  Date.UTC(2026, 4, 16, 14, 15), // 土: 1件
                  Date.UTC(2026, 4, 17, 9, 0), // 日: 2件
                  Date.UTC(2026, 4, 17, 21, 30),
                  Date.UTC(2026, 4, 18, 8, 0), // 月: 2件
                  Date.UTC(2026, 4, 18, 19, 45),
                  Date.UTC(2026, 4, 19, 7, 30), // 火: 1件
                  Date.UTC(2026, 4, 20, 7, 20), // 水(今日): 3件
                  Date.UTC(2026, 4, 20, 13, 0),
                  Date.UTC(2026, 4, 20, 22, 10),
                ]}
                accentColor={accentColor}
              />
              <Text
                modifiers={[
                  padding({ leading: 16 }),
                  font({ size: 24, weight: "semibold" }),
                ]}
              >
                Field Stats
              </Text>
              <StatCard
                label="エントリー数"
                value={String(entryCount)}
                unit="件"
                accentColor={accentColor}
              />
              <StatCard
                label="今週"
                value="7"
                unit="件"
                accentColor={accentColor}
              />
              <StatCard
                label="連続記録"
                value="5"
                unit="日"
                accentColor={accentColor}
              />
              <StatCard
                label="週平均"
                value="4.2"
                unit="件"
                accentColor={accentColor}
              />
            </VStack>

            <Spacer />
          </VStack>
        </ScrollView>
      </Host>
    </View>
  );
}
