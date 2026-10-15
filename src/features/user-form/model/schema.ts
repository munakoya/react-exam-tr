import { z } from "zod";
import type { User } from "@/entities/user";

/**
 * ユーザーの登録・編集フォームの入力チェック（zod） ── features/user-form/model
 *
 * フォームの値は「入力中の値（input）」と「チェック後の値（output）」で型が違う。
 *   age … 入力中は文字列（"20" や ""） → チェック後は number
 * z.input / z.output で、それぞれの型を取り出せる。
 *
 * メールアドレスの重複チェックには「ほかのユーザーのメールアドレス」が要るので、
 * スキーマを関数で作り、引数で受け取る（編集のときは自分自身を除いて渡す）。
 */
export const createUserFormSchema = (otherEmails: string[]) =>
  z.object({
    // trim()：前後の空白を取り除いてからチェックする（空白だけの入力をはじく）
    name: z
      .string()
      .trim()
      .min(1, "名前を入力してください")
      .max(30, "30文字以内で入力してください"),

    // 文字列で受け取って、チェックしてから数値に変換する
    age: z
      .string()
      .trim()
      .min(1, "年齢を入力してください")
      // abort: true … ここで失敗したら後ろのチェックをしない（エラー文が1つになる）
      .refine((value) => /^\d+$/.test(value), {
        error: "半角数字で入力してください",
        abort: true,
      })
      .transform((value) => Number(value))
      // pipe：変換後の数値を、次のスキーマでチェックする
      .pipe(
        z
          .number()
          .int()
          .min(0, "0〜150で入力してください")
          .max(150, "0〜150で入力してください"),
      ),

    // pipe：前のチェック（空欄でないか）を通ったら、次のチェック（メールの形か）へ渡す
    email: z
      .string()
      .trim()
      .min(1, "メールアドレスを入力してください")
      .pipe(z.email("メールアドレスの形式が正しくありません"))
      // refine：zod の決まったチェックにない条件を、true / false を返す関数で書く
      .refine(
        (email) => !otherEmails.includes(email),
        "このメールアドレスは登録済みです",
      ),

    // 任意の文字列
    hobby: z.string().trim().max(100, "100文字以内で入力してください"),
  });

type UserFormSchema = ReturnType<typeof createUserFormSchema>;
/** 入力中の値（useForm の defaultValues の型） */
export type UserFormInput = z.input<UserFormSchema>;
/** チェックを通った後の値（onSubmit で受け取る型）。entities の UserInput と同じ形になる */
export type UserFormValues = z.output<UserFormSchema>;

/**
 * フォームの初期値を作る
 *
 *   toFormInput()      … 登録：空欄
 *   toFormInput(user)  … 編集：今の値を入れておく
 */
export const toFormInput = (user?: User): UserFormInput => ({
  name: user?.name ?? "",
  // 数値を文字列にする（入力欄の値は文字列）
  age: user === undefined ? "" : String(user.age),
  email: user?.email ?? "",
  hobby: user?.hobby ?? "",
});
