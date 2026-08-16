import { Dispatch, SetStateAction, useState } from "react";
import { PlatformColor, View } from "react-native";

import {
  Button,
  Host,
  HStack,
  Image,
  List,
  RoundedRectangle,
  Section,
  Spacer,
  TextField,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  environment,
  foregroundStyle,
  frame,
  listRowInsets,
  onTapGesture,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { FIELD_ICONS, FIELD_LABELS, FieldType } from "@/constants/journal";
import { JournalMetaObj, type FieldDraftObj } from "@/hooks/journal/use-journal-field";
import { hexColorSchema } from "@/utils/journal/color";

import { FieldBottomSheet } from "./field-bottom-sheet";
import { IconSelectBottomSheet } from "./icon-select-bottom-sheet";

type Props = {
  /** フィールド一覧 */
  fields: FieldDraftObj[];
  /** フィールドを追加する関数 */
  addField: (type: FieldType) => void;
  /** フィールドのラベルを更新する関数 */
  renameField: (id: string, newLabel: string) => void;
  /** フィールドを削除する関数 */
  deleteField: (indices: number[]) => void;
  /** フィールドを並び替える関数 */
  moveField: (sourceIndices: number[], destination: number) => void;
  /** ジャーナルのメタ情報 */
  meta: JournalMetaObj;
  /** ジャーナルのメタ情報をセットする関数 */
  setMeta: Dispatch<SetStateAction<JournalMetaObj>>;
};

/**
 * ジャーナル作成画面
 */
export function JournalCreateView({
  fields,
  addField,
  renameField,
  deleteField,
  moveField,
  meta,
  setMeta,
}: Props) {
  const [showSheet, setShowSheet] = useState<{
    field: boolean;
    icon: boolean;
  }>({
    field: false,
    icon: false,
  });

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            environment("editMode", "inactive"),
          ]}
        >
          {/* ジャーナル名・アイコン・カラー */}
          <Section>
            <HStack spacing={10} modifiers={[frame({ maxWidth: 9999 })]}>
              {/* アイコンボタン */}
              <ZStack
                modifiers={[
                  frame({ width: 32, height: 32 }),
                  onTapGesture(() => setShowSheet((prev) => ({ ...prev, icon: true }))),
                ]}
              >
                <RoundedRectangle
                  cornerRadius={100}
                  modifiers={[
                    frame({ maxWidth: 9999, maxHeight: 9999 }),
                    foregroundStyle(meta.color),
                  ]}
                />
                <Image systemName={meta.icon} color="white" size={14} />
              </ZStack>

              {/* ジャーナル名 */}
              <TextField
                placeholder="Journal Name"
                defaultValue={meta.name}
                onValueChange={(value) => setMeta((prev) => ({ ...prev, name: value }))}
                modifiers={[frame({ maxWidth: 9999 })]}
              />
            </HStack>
          </Section>

          {/* フィールド */}
          <Section title="Fields">
            <List.ForEach onMove={moveField} onDelete={deleteField}>
              {fields.map((field) => (
                <HStack key={field.id} spacing={16} modifiers={[listRowInsets({ leading: 16 })]}>
                  <Image
                    systemName={FIELD_ICONS[field.type]}
                    color={PlatformColor("systemIndigo")}
                    size={22}
                    modifiers={[frame({ width: 24 })]}
                  />
                  <TextField
                    placeholder={`${FIELD_LABELS[field.type]} Field Name`}
                    defaultValue={field.label}
                    onValueChange={(value) => renameField(field.id, value)}
                    modifiers={[frame({ maxWidth: 9999 })]}
                  />
                  <Spacer />
                  <Image
                    systemName="line.3.horizontal"
                    color={PlatformColor("tertiaryLabel")}
                    size={22}
                    modifiers={[frame({ width: 28 }), padding({ trailing: 14 })]}
                  />
                </HStack>
              ))}
            </List.ForEach>

            <Button
              label="Add Field"
              systemImage="plus"
              onPress={() => setShowSheet((prev) => ({ ...prev, field: true }))}
            />
          </Section>
        </List>

        {/* フィールド追加ボトムシート */}
        <FieldBottomSheet
          isPresented={showSheet.field}
          onIsPresentedChange={(v) => setShowSheet((prev) => ({ ...prev, field: v }))}
          onAdd={addField}
        />

        {/* アイコン選択ボトムシート */}
        <IconSelectBottomSheet
          isPresented={showSheet.icon}
          onIsPresentedChange={(v) => setShowSheet((prev) => ({ ...prev, icon: v }))}
          selectedIcon={meta.icon}
          selectedColor={meta.color}
          onSelectIcon={(icon) => setMeta((prev) => ({ ...prev, icon }))}
          onSelectColor={(color) => {
            if (hexColorSchema.safeParse(color).success) setMeta((prev) => ({ ...prev, color }));
          }}
        />
      </Host>
    </View>
  );
}
