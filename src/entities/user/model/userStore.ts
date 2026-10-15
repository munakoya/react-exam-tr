import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageKey } from "@/shared/config";
import { mergeWithSchema } from "@/shared/lib";
import { userSchema, type User, type UserInput } from "./user";

/**
 * ユーザーの一覧を持つ store（Zustand ＋ persist） ── entities/user/model
 *
 * persist を挟むと、state が変わるたびに localStorage へ自動で保存し、
 * ページを開いたときに自動で読み込む（保存・読み込みのコードは書かなくてよい）。
 *
 * ---------- 画面での使い方 ----------
 *   const users = useUserStore((state) => state.users);      // 値
 *   const addUser = useUserStore((state) => state.addUser);  // action
 *
 *   // ⚠ セレクターの中で filter / map をしない（毎回新しい配列になり、無限に再描画される）
 *   //   find は store の中の同じオブジェクトを返すので OK
 */

// 値（保存するもの）
type UserState = {
  users: User[];
};

// 値の変え方
type UserActions = {
  addUser: (input: UserInput) => void;
  updateUser: (id: string, input: UserInput) => void;
  removeUser: (id: string) => void;
  /** 選択した複数のユーザーをまとめて削除する */
  removeUsers: (ids: string[]) => void;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      users: [],

      // 元の配列は書き換えず、新しい配列を作って返す（イミュータブルな更新）
      addUser: (input) => {
        const now = new Date().toISOString();
        const user: User = {
          ...input,
          id: crypto.randomUUID(), // ブラウザ標準の id 作成
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ users: [user, ...state.users] })); // 先頭に追加（新しい順）
      },

      // map：id が同じものだけ差し替え、ほかはそのまま
      updateUser: (id, input) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, ...input, updatedAt: new Date().toISOString() }
              : user,
          ),
        })),

      // filter：id が違うものだけ残す ＝ その id を消す
      removeUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),

      // includes：消す id の一覧に入っていないものだけ残す
      removeUsers: (ids) =>
        set((state) => ({
          users: state.users.filter((user) => !ids.includes(user.id)),
        })),
    }),
    {
      name: storageKey("users"), // localStorage のキー（"user-management:users"）
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users }), // 保存するのは値だけ（関数は保存できない）
      version: 1, // 保存する形を変えたら上げる
      // 読み込んだ値を zod でチェックし、形が崩れていたら初期値で始める（shared/lib/persist.ts）
      merge: mergeWithSchema(z.object({ users: z.array(userSchema) })),
    },
  ),
);
