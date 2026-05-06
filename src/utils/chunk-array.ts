/**
 * 配列を指定したサイズのチャンクに分割する
 * @param arr 分割する配列
 * @param size チャンクのサイズ
 */
export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
