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

import { FIELD_ICONS, FieldType } from "@/core/constants";
import {
  JournalMetaObj,
  type FieldObj,
} from "@/hooks/journal/use-journal-field";

import { FieldBottomSheet } from "./field-bottom-sheet";
import { IconSelectBottomSheet } from "./icon-select-bottom-sheet";

/**
 * 黒・白に近すぎる色を弾く（輝度が極端な色を除外）
 * @param hex "#RRGGBB" 形式の色文字列
 */
function isValidColor(hex: string): boolean {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = ((num >> 16) & 0xff) / 255;
  const g = ((num >> 8) & 0xff) / 255;
  const b = (num & 0xff) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.05 && luminance < 0.9;
}

type Props = {
  /** フィールド一覧 */
  fields: FieldObj[];
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
  const [showFieldSheet, setShowFieldSheet] = useState(false);
  const [showIconSheet, setShowIconSheet] = useState(false);

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
                  onTapGesture(() => setShowIconSheet(true)),
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
                onValueChange={(value) =>
                  setMeta((prev) => ({ ...prev, name: value }))
                }
                modifiers={[frame({ maxWidth: 9999 })]}
              />
            </HStack>
          </Section>

          {/* フィールド */}
          <Section title="Fields">
            <List.ForEach onMove={moveField} onDelete={deleteField}>
              {fields.map((field) => (
                <HStack
                  key={field.id}
                  spacing={16}
                  modifiers={[listRowInsets({ leading: 16 })]}
                >
                  <Image
                    systemName={FIELD_ICONS[field.type]}
                    color={PlatformColor("systemIndigo")}
                    size={22}
                    modifiers={[frame({ width: 24 })]}
                  />
                  <TextField
                    placeholder={`${field.label} Field Name`}
                    onValueChange={(value) => renameField(field.id, value)}
                    modifiers={[frame({ maxWidth: 9999 })]}
                  />
                  <Spacer />
                  <Image
                    systemName="line.3.horizontal"
                    color={PlatformColor("tertiaryLabel")}
                    size={22}
                    modifiers={[
                      frame({ width: 28 }),
                      padding({ trailing: 14 }),
                    ]}
                  />
                </HStack>
              ))}
            </List.ForEach>

            <Button
              label="Add Field"
              systemImage="plus"
              onPress={() => setShowFieldSheet(true)}
            />
          </Section>
        </List>

        {/* フィールド追加ボトムシート */}
        <FieldBottomSheet
          isPresented={showFieldSheet}
          onIsPresentedChange={setShowFieldSheet}
          onAdd={addField}
        />

        {/* アイコン選択ボトムシート */}
        <IconSelectBottomSheet
          isPresented={showIconSheet}
          onIsPresentedChange={setShowIconSheet}
          selectedIcon={meta.icon}
          selectedColor={meta.color}
          onSelectIcon={(icon) => setMeta((prev) => ({ ...prev, icon }))}
          onSelectColor={(color) => {
            if (isValidColor(color)) setMeta((prev) => ({ ...prev, color }));
          }}
        />
      </Host>
    </View>
  );
}
