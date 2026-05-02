import { PlatformColor, View } from "react-native";

import { Grid, Host, ScrollView, VStack } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";

import { JournalCard } from "@/components/journal/journal-card";
import { JOURNALS } from "@/mocks/journals";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * ジャーナル一覧画面
 */
export function JournalView() {
  const rows = chunkArray(JOURNALS, 2);

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
                    <JournalCard
                      key={journal.id}
                      id={journal.id}
                      name={journal.name}
                      icon={journal.icon}
                      color={journal.color}
                      count={journal.count}
                    />
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
