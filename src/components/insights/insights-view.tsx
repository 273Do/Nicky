import { useState } from "react";
import { PlatformColor, View } from "react-native";

import {
  Host,
  HStack,
  RoundedRectangle,
  ScrollView,
  Spacer,
  Text,
  VStack,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getJournalsQuery } from "@/db/queries/journals";

import { JournalChipList } from "./journal-chip";

type StatCardProps = {
  label: string;
  value: string;
  unit: string;
  accentColor: string;
};

function StatCard({ label, value, unit, accentColor }: StatCardProps) {
  return (
    <ZStack
      alignment="topLeading"
      modifiers={[frame({ maxWidth: 9999, height: 100 })]}
    >
      <RoundedRectangle
        cornerRadius={16}
        modifiers={[
          frame({ maxWidth: 9999, maxHeight: 9999 }),
          foregroundStyle(PlatformColor("secondarySystemGroupedBackground")),
        ]}
      />
      <VStack
        alignment="leading"
        spacing={6}
        modifiers={[padding({ horizontal: 16, vertical: 16 })]}
      >
        <Text
          modifiers={[
            font({ size: 12 }),
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
          ]}
        >
          {label}
        </Text>
        <HStack spacing={3}>
          <Text
            modifiers={[
              font({ size: 28, weight: "bold" }),
              foregroundStyle(accentColor),
            ]}
          >
            {value}
          </Text>
          <Text
            modifiers={[
              font({ size: 14 }),
              foregroundStyle({ type: "hierarchical", style: "secondary" }),
            ]}
          >
            {unit}
          </Text>
        </HStack>
      </VStack>
    </ZStack>
  );
}

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
  const accentColor = activeJournalData?.color ?? "#000000";

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
              spacing={12}
              modifiers={[padding({ horizontal: 16, bottom: 16 })]}
            >
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
