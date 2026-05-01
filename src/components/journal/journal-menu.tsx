import React from "react";

import { Button, Divider, Image, Menu } from "@expo/ui/swift-ui";
import { buttonStyle } from "@expo/ui/swift-ui/modifiers";

export const JournalMenu = () => {
  return (
    <Menu
      label={<Image systemName="ellipsis.circle" size={22} />}
      modifiers={[buttonStyle("glass")]}
    >
      <Button label="edit" systemImage="ellipsis.circle" />
      <Button label="edit name" systemImage="pencil" />
      <Divider />
      <Button label="duplicate" systemImage="plus.rectangle.on.rectangle" />
      <Button label="delete" systemImage="trash" role="destructive" />
    </Menu>
  );
};
