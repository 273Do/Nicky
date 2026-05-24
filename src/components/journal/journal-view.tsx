import { PlatformColor, View } from "react-native";

import { Grid, Host, ScrollView, VStack } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";

import { JournalCard } from "@/components/journal/journal-card";
import { useJournalList } from "@/utils/journal/use-journal-list";

/**
 * ジャーナル一覧画面
 */
export function JournalView() {
  const { rows } = useJournalList();

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{
          flex: 1,
          backgroundColor: PlatformColor("systemBackground"),
        }}
        useViewportSizeMeasurement
      >
        <ScrollView showsIndicators={false}>
          <VStack
            alignment="leading"
            spacing={0}
            modifiers={[padding({ horizontal: 16 })]}
          >
            <Grid
              verticalSpacing={10}
              horizontalSpacing={10}
              modifiers={[padding({ top: 8, bottom: 32 })]}
            >
              {rows.map((row, rowIndex) => (
                <Grid.Row key={rowIndex}>
                  {row.map((journal) => (
                    <JournalCard key={journal.id} journal={journal} />
                  ))}
                </Grid.Row>
              ))}
            </Grid>
          </VStack>
        </ScrollView>
      </Host>
    </View>
  );
}
