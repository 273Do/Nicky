import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { Button, Host, HStack, Image, List, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useRouter } from "expo-router";

import { FREE_JOURNAL_LIMIT } from "@/constants/purchases";
import { getJournalsQuery, JournalWithCountObj } from "@/db/queries/journals";
import { useMainHeaderLeftItems } from "@/hooks/navigation/use-main-header-left-items";
import { useProGate } from "@/hooks/purchases/use-pro-gate";
import { authenticate } from "@/utils/local-auth";

/**
 * テンプレート画面
 */
export default function TemplateScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const headerLeftItems = useMainHeaderLeftItems("template");

  const { data: journals } = useLiveQuery(getJournalsQuery);
  const journalList: JournalWithCountObj[] = journals ?? [];

  const { isPro, openPaywall } = useProGate();
  // 無料プランのジャーナル数上限
  const journalLimitReached = !isPro && journalList.length >= FREE_JOURNAL_LIMIT;

  const handleEdit = async (journal: JournalWithCountObj) => {
    // ロック中のジャーナルは認証してから編集画面を開く
    if (journal.locked && !(await authenticate())) return;
    router.push(`/template/edit?journalId=${journal.id}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("template.title"),
          headerLargeTitleEnabled: true,
          unstable_headerLeftItems: () => headerLeftItems,
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t("journal.newJournal"),
              icon: { type: "sfSymbol", name: "folder.badge.plus" },
              onPress: () =>
                journalLimitReached ? openPaywall() : router.push("/template/create"),
            },
            {
              type: "button",
              label: t("settings.title"),
              icon: { type: "sfSymbol", name: "gearshape" },
              onPress: () => router.push("/template/settings"),
            },
          ],
        }}
      />
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemGroupedBackground") }}
        useViewportSizeMeasurement
      >
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
          <Section>
            {journalList.map((journal) => (
              <Button
                key={journal.id}
                onPress={() => void handleEdit(journal)}
                modifiers={[foregroundStyle({ type: "hierarchical", style: "primary" })]}
              >
                <HStack spacing={12}>
                  <Image
                    systemName={journal.icon}
                    color={journal.color}
                    size={17}
                    modifiers={[frame({ width: 28 })]}
                  />
                  <Text>{journal.name}</Text>
                  <Spacer />
                  {journal.locked ? (
                    <Image
                      systemName="lock.fill"
                      color={PlatformColor("tertiaryLabel")}
                      size={13}
                    />
                  ) : null}
                  <Image
                    systemName="chevron.right"
                    color={PlatformColor("tertiaryLabel")}
                    size={13}
                  />
                </HStack>
              </Button>
            ))}
          </Section>
        </List>
      </Host>
    </>
  );
}
