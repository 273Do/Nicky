import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  Text,
  TextField,
  type TextFieldRef,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  animation,
  Animation,
  environment,
  foregroundStyle,
  frame,
  listRowInsets,
  onTapGesture,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { FIELD_ICONS, FIELD_LABEL_KEYS, FieldType } from "@/constants/journal";
import { JournalMetaObj, type FieldDraftObj } from "@/hooks/journal/use-journal-field";
import { cleanNumericInput } from "@/utils/entry/field-value";
import { hexColorSchema } from "@/utils/journal/color";
import { decodeRatingLabel } from "@/utils/journal/rating-label";

import { secondary } from "../entry/entry-row";
import { FieldBottomSheet } from "./field-bottom-sheet";
import { IconSelectBottomSheet } from "./icon-select-bottom-sheet";

/**
 * 数値のみ入力可能な TextField
 */
function NumberTextField({
  defaultValue,
  placeholder,
  onValueChange,
}: {
  defaultValue: string;
  placeholder: string;
  onValueChange: (num: number) => void;
}) {
  const ref = useRef<TextFieldRef>(null);

  const handleChange = async (v: string) => {
    const cleaned = cleanNumericInput(v, 1);
    if (cleaned !== v) await ref.current?.setText(cleaned);
    const num = parseFloat(cleaned);
    if (!isNaN(num)) onValueChange(num);
  };

  return (
    <TextField
      ref={ref}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onValueChange={handleChange}
    />
  );
}

type Props = {
  /** フィールド一覧 */
  fields: FieldDraftObj[];
  /** フィールドを追加する関数 */
  addField: (type: FieldType) => void;
  /** フィールドのラベルを更新する関数 */
  renameField: (id: string, newLabel: string) => void;
  /** rating フィールドの min/max を更新する関数 */
  updateRatingRange: (id: string, min: number, max: number) => void;
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
  updateRatingRange,
  deleteField,
  moveField,
  meta,
  setMeta,
}: Props) {
  const { t } = useTranslation();
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
            animation(Animation.easeInOut({ duration: 0.25 }), fields.length),
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
                placeholder={t("journal.namePlaceholder")}
                defaultValue={meta.name}
                onValueChange={(value) => setMeta((prev) => ({ ...prev, name: value }))}
                modifiers={[frame({ maxWidth: 9999 })]}
              />
            </HStack>
          </Section>

          {/* フィールド */}
          <Section title={t("journal.fields")}>
            <List.ForEach onMove={moveField} onDelete={deleteField}>
              {fields.map((field) => {
                const isRating = field.type === "rating";
                const ratingLabel = isRating ? decodeRatingLabel(field.label) : null;

                return (
                  <HStack
                    key={field.id}
                    spacing={isRating ? 8 : 16}
                    modifiers={[listRowInsets({ leading: 16 })]}
                  >
                    <Image
                      systemName={FIELD_ICONS[field.type]}
                      color={PlatformColor("systemIndigo")}
                      size={22}
                      modifiers={[frame({ width: 24 })]}
                    />
                    {isRating && (
                      <HStack modifiers={[frame({ width: 100 })]}>
                        <Spacer />
                        <NumberTextField
                          defaultValue={String(ratingLabel!.min)}
                          placeholder={t("field.min")}
                          onValueChange={(num) =>
                            updateRatingRange(field.id, num, ratingLabel!.max)
                          }
                        />
                        <Text modifiers={[secondary]}>~</Text>
                        <Spacer />
                        <NumberTextField
                          defaultValue={String(ratingLabel!.max)}
                          placeholder={t("field.max")}
                          onValueChange={(num) =>
                            updateRatingRange(field.id, ratingLabel!.min, num)
                          }
                        />
                      </HStack>
                    )}
                    <TextField
                      placeholder={t("journal.fieldPlaceholder", {
                        type: t(FIELD_LABEL_KEYS[field.type]),
                      })}
                      defaultValue={isRating ? ratingLabel!.name : field.label}
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
                );
              })}
            </List.ForEach>

            <Button
              label={t("journal.addField")}
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
