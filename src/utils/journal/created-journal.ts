/**
 * ジャーナル作成後に一覧画面へ ID を受け渡すための一時ストア
 * consume で読み取ると自動でクリアされる
 */
let createdId: string | null = null;

export const setCreatedJournalId = (id: string) => {
  createdId = id;
};

export const consumeCreatedJournalId = (): string | null => {
  const id = createdId;
  createdId = null;
  return id;
};
