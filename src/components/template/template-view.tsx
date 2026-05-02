import { PlatformColor, View } from "react-native";

import { Grid, Host, ScrollView, VStack } from "@expo/ui/swift-ui";
import { padding } from "@expo/ui/swift-ui/modifiers";

import { TemplateCard } from "@/components/template/template-card";
import { TEMPLATES } from "@/mocks/templates";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * テンプレート一覧画面
 */
export function TemplateView() {
  const rows = chunkArray(TEMPLATES, 2);

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
                  {row.map((template) => (
                    <TemplateCard
                      key={template.id}
                      id={template.id}
                      name={template.name}
                      icon={template.icon}
                      color={template.color}
                      count={template.count}
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
