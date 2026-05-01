import { Grid, ScrollView, VStack, ZStack } from "@expo/ui/swift-ui";
import { frame, padding } from "@expo/ui/swift-ui/modifiers";

import { JOURNALS } from "@/mocks/journals";

import { Journal } from "./journal";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
export default function JournalList() {
  const rows = chunkArray(JOURNALS, 2);

  return (
    <ZStack
      alignment="top"
      modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}
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
                  <Journal
                    key={journal.id}
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
    </ZStack>
  );
}
