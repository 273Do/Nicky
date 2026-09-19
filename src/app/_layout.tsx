import "@/i18n";
import "@/polyfills";
import React from "react";

import * as SplashScreen from "expo-splash-screen";

import AppTabs from "@/components/app-tabs";
import { DrizzleProvider } from "@/components/drizzle-provider";
import { useAutoReflection } from "@/hooks/settings/use-auto-reflection";
import { useJournalNotifications } from "@/hooks/use-journal-notifications";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  useAutoReflection();
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
