import { List, Section } from "@expo/ui/swift-ui";
import { frame, listStyle } from "@expo/ui/swift-ui/modifiers";

import { EntryNumber } from "./field/emtry-number";
import { EntryCheck } from "./field/entry-check";
import { EntryDate } from "./field/entry-date";
import { EntryLocation } from "./field/entry-location";
import { EntryLongText } from "./field/entry-long-text";
import { EntryMedia } from "./field/entry-media";
import { EntryText } from "./field/entry-text";
import { EntryTime } from "./field/entry-time";

const edit = false;
/**
 * 全フィールドタイプのフォームサンプル
 */
export function AllformList() {
  return (
    <List
      modifiers={[
        frame({ maxWidth: 9999, maxHeight: 9999 }),
        listStyle("plain"),
      ]}
    >
      <Section>
        <EntryText
          label="text"
          defaultValue="Lorem ipsum dolor sit amet"
          edit={edit}
        />
        <EntryLongText
          label="longText"
          defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis atque hic accusamus sint saepe deleniti provident minus eum? Eaque repellat nobis dignissimos sapiente temporibus officia, alias similique illum ullam necessitatibus."
          edit={edit}
        />
        <EntryNumber label="number" edit={edit} />
        <EntryCheck label="checklist" defaultValue={true} edit={edit} />
        <EntryDate label="date" edit={edit} />
        <EntryTime label="time" edit={edit} />
        <EntryMedia label="media" edit={edit} />
        <EntryLocation label="location" edit={edit} />
      </Section>
    </List>
  );
}
