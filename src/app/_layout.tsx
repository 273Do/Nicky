import "@/i18n";
import "@/utils/purchases/configure";
import React from "react";

import * as SplashScreen from "expo-splash-screen";

import AppTabs from "@/components/app-tabs";
import { DrizzleProvider } from "@/components/drizzle-provider";
import { useJournalNotifications } from "@/hooks/use-journal-notifications";

void SplashScreen.preventAutoHideAsync();

function AppContent() {
  useJournalNotifications();

  return <AppTabs />;
}

export default function RootLayout() {
  return (
    <DrizzleProvider>
      <AppContent />
    </DrizzleProvider>
  );
}
