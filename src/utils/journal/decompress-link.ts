/** lz-string の compressToEncodedURIComponent が使う文字 */
const URI_SAFE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
const ALPHABET_INDEX = new Map(URI_SAFE_ALPHABET.split("").map((char, index) => [char, index]));

/** 1文字あたりのビット数（6ビット）の最上位ビット */
const RESET_VALUE = 32;

/**
 * lz-string の decompressFromEncodedURIComponent を、入力長と展開後の長さに上限を設けて移植したもの
 *
 * LZ 系の展開は入力長の2乗に比例して出力が膨らみうるため、署名の検証前に巨大な文字列を作らないよう、
 * 上限を超えた時点で展開をやめる
 * @param input compressToEncodedURIComponent で圧縮した文字列
 * @param maxInputLength 受け付ける入力の最大文字数
 * @param maxOutputLength 展開後の最大文字数
 * @returns 展開した文字列。不正な入力や上限を超えた場合は null
 */
export const decompressLinkPayload = (
  input: string,
  maxInputLength: number,
  maxOutputLength: number,
): string | null => {
  if (input === "" || input.length > maxInputLength) return null;

  const values: number[] = [];
  for (const char of input) {
    const value = ALPHABET_INDEX.get(char);
    if (value === undefined) return null;
    values.push(value);
  }

  let val = values[0];
  let position = RESET_VALUE;
  let index = 1;

  const readBits = (numBits: number) => {
    let bits = 0;
    for (let power = 1; power !== 1 << numBits; power <<= 1) {
      const resb = val & position;
      position >>= 1;
      if (position === 0) {
        position = RESET_VALUE;
        // 末尾を超えた分は 0 として読む
        val = values[index++] ?? 0;
      }
      if (resb > 0) bits |= power;
    }
    return bits;
  };

  const dictionary: string[] = [];
  let dictSize = 4;
  let enlargeIn = 4;
  let numBits = 3;

  const first = readBits(2);
  if (first === 2) return "";
  if (first !== 0 && first !== 1) return null;

  let w = String.fromCharCode(readBits(first === 0 ? 8 : 16));
  dictionary[3] = w;
  const result = [w];
  let outputLength = w.length;

  while (true) {
    if (index > values.length) return null;

    let c = readBits(numBits);

    if (c === 0 || c === 1) {
      dictionary[dictSize++] = String.fromCharCode(readBits(c === 0 ? 8 : 16));
      c = dictSize - 1;
      enlargeIn--;
    } else if (c === 2) {
      return result.join("");
    }

    if (enlargeIn === 0) {
      enlargeIn = 1 << numBits;
      numBits++;
    }

    let entry: string;
    if (dictionary[c]) {
      entry = dictionary[c];
    } else if (c === dictSize) {
      entry = w + w.charAt(0);
    } else {
      return null;
    }

    outputLength += entry.length;
    if (outputLength > maxOutputLength) return null;
    result.push(entry);

    dictionary[dictSize++] = w + entry.charAt(0);
    enlargeIn--;
    w = entry;

    if (enlargeIn === 0) {
      enlargeIn = 1 << numBits;
      numBits++;
    }
  }
};
