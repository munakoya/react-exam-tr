import { z } from "zod";

/**
 * ユーザーの型 ── entities/user/model
 *
 * entities には、アプリで扱う「もの」の 型・store・表示 を置く。
 * 型は zod のスキーマから作る（z.infer）。1つの定義を
 *   - TypeScript の型
 *   - localStorage から読み込んだデータのチェック（userStore.ts）
 * の両方に使える。
 */

// 保存する形。入力チェック（文字数など）はフォームのスキーマ（features/user-form）に書く
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().int(),
  email: z.string(),
  hobby: z.string(), // 任意。未入力は ""
  createdAt: z.string(), // ISO 形式の日時。Date 型は JSON に保存できないので文字列で持つ
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// 登録・更新のときにフォームから受け取る値。id と日時は store で付けるので除く（Omit）
export type UserInput = Omit<User, "id" | "createdAt" | "updatedAt">;
