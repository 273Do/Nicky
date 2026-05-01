import React from "react";

import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Journal</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "books.vertical.fill",
            selected: "books.vertical.fill",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Report</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "chart.line.text.clipboard.fill",
            selected: "chart.line.text.clipboard.fill",
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
