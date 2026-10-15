// 表示用の整形

// ISO 形式の日時（"2026-10-08T01:23:45.000Z"）→ "2026/10/08"
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
