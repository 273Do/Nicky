import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import type { TabListProps, TabTriggerSlotProps } from "expo-router/ui";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={styles.tabButton}>
      <Text>{children}</Text>
    </Pressable>
  );
}

function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabList}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
