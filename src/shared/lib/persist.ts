import type { z } from "zod";

// localStorage から読み込んだデータを、zod でチェックしてから store に戻すための関数
// （古い形のデータや書き換えられたデータで画面が壊れないようにする）
//
// 使い方: persist(..., { merge: mergeWithSchema(スキーマ) })
//
// => が2段になっている理由:
//   persist は merge を (persisted, current) の2つだけ渡して呼ぶので、スキーマを渡す口がない。
//   そこで先にスキーマを受け取って「そのスキーマでチェックする merge 関数」を作って渡す
export const mergeWithSchema =
  // T：保存するデータの型（例: { users: User[] }）
  <T extends object>(schema: z.ZodType<T>) =>
    // S：store 全体の型（T に addUser などの関数を足したもの）
    // persisted：localStorage から読み込んだデータ / current：store の初期状態
    <S extends T>(persisted: unknown, current: S): S => {
      // ① まだ何も保存されていない → 初期状態のまま
      if (persisted === undefined) return current;

      // ② 形がおかしい → 保存データは捨てて初期状態のまま
      const result = schema.safeParse(persisted);
      if (!result.success) {
        console.warn(
          "保存データの形が正しくないため、初期状態で始めます",
          result.error,
        );
        return current;
      }

      // ③ 正しい → 初期状態に読み込んだデータを上書きして使う
      //   （関数は localStorage に保存できないので、関数を持つ current をベースにする）
      return { ...current, ...result.data };
    };
