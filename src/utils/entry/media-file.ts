import * as Crypto from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";

const MEDIA_DIR = "media";

/** media ディレクトリを取得（なければ作成） */
const ensureMediaDir = (): Directory => {
  const dir = new Directory(Paths.document, MEDIA_DIR);
  if (!dir.exists) {
    dir.create();
  }
  return dir;
};

/**
 * ピッカーの一時 URI から Document/media/ にコピーし、相対パスを返す
 * @param pickerUri ピッカーが返した file:// URI
 * @returns 相対パス
 */
export const saveMediaImage = (pickerUri: string): string => {
  const dir = ensureMediaDir();
  const ext = /\.([a-zA-Z0-9]{1,5})(?:[?#].*)?$/.exec(pickerUri)?.[1] ?? "jpg";
  const filename = `${Crypto.randomUUID()}.${ext}`;

  const src = new File(pickerUri);
  const dest = new File(dir, filename);

  src.copy(dest);

  return `${MEDIA_DIR}/${filename}`;
};

/**
 * 相対パスを file:// URI に変換
 * @param relativePath 相対パス
 */
export const getMediaImageUri = (relativePath: string): string => {
  const file = new File(Paths.document, relativePath);
  return file.uri;
};

/**
 * メディア画像ファイルを削除
 * @param relativePath 相対パス
 */
export const deleteMediaImage = (relativePath: string): void => {
  const file = new File(Paths.document, relativePath);
  if (file.exists) {
    file.delete();
  }
};
