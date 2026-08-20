/** 3 スロットの循環差分（-1, 0, +1） */
export const slotDiff = (slotIndex: number, center: number) => {
  "worklet";
  let d = slotIndex - center;
  if (d > 1) d -= 3;
  if (d < -1) d += 3;
  return d;
};
