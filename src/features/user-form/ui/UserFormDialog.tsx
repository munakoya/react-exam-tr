import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { useUserStore, type User } from "@/entities/user";
import { FormTextField } from "@/shared/ui";
import {
  createUserFormSchema,
  toFormInput,
  type UserFormInput,
  type UserFormValues,
} from "../model/schema";

/**
 * ユーザーの登録・編集ダイアログ（React Hook Form ＋ zod ＋ MUI） ── features/user-form/ui
 *
 * 登録と編集で同じダイアログを使い回し、違いは user を渡すかどうかで決める。
 *   user なし → 登録（空欄から始めて addUser）
 *   user あり → 編集（今の値から始めて updateUser）
 *
 *   const dialog = useFormDialog<User>();
 *   <Button onClick={dialog.openNew}>登録</Button>
 *   <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
 */

type UserFormDialogProps = {
  open: boolean;
  /** 編集するユーザー。登録のときは渡さない */
  user?: User;
  /** 閉じるとき（キャンセル・保存・Esc・背景のクリック）に呼ばれる */
  onClose: () => void;
};

export const UserFormDialog = ({ open, user, onClose }: UserFormDialogProps) => (
  // MUI の Dialog は、閉じると中身（UserForm）を消し、開くたびに作り直す。
  // なので useForm を中身に書いておけば、毎回 defaultValues から始まる（reset() が要らない）
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <UserForm user={user} onDone={onClose} />
  </Dialog>
);

// ---------- ダイアログの中身（フォーム） ----------

type UserFormProps = {
  user?: User;
  onDone: () => void;
};

const UserForm = ({ user, onDone }: UserFormProps) => {
  const isEdit = user !== undefined;
  const users = useUserStore((state) => state.users);
  const addUser = useUserStore((state) => state.addUser);
  const updateUser = useUserStore((state) => state.updateUser);

  // 重複チェック用：自分以外のメールアドレス（編集のとき、自分のメールはそのまま保存できるように）
  const otherEmails = users
    .filter((item) => item.id !== user?.id)
    .map((item) => item.email);

  // useForm<入力中の型, context（使わない）, チェック後の型>
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserFormInput, unknown, UserFormValues>({
    resolver: zodResolver(createUserFormSchema(otherEmails)),
    defaultValues: toFormInput(user),
  });

  // ここに届くのはチェックを通った値だけ（age は number に変換済み）
  const onSubmit = (values: UserFormValues) => {
    if (isEdit) {
      updateUser(user.id, values);
    } else {
      addUser(values);
    }
    onDone();
  };

  return (
    // noValidate：ブラウザ標準のチェック（吹き出し）を止め、zod のエラー表示にそろえる
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <DialogTitle>{isEdit ? "ユーザーを編集" : "ユーザーを登録"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormTextField
            control={control}
            name="name"
            label="名前"
            required
            autoFocus
          />
          <FormTextField
            control={control}
            name="age"
            label="年齢"
            required
            helperText="0〜150"
            // inputMode でスマホに数字キーボードを出す
            slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 3 } }}
          />
          <FormTextField
            control={control}
            name="email"
            label="メールアドレス"
            type="email"
            required
            placeholder="taro@example.com"
          />
          <FormTextField
            control={control}
            name="hobby"
            label="趣味"
            multiline
            minRows={2}
            helperText="任意。100文字以内"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onDone}>キャンセル</Button>
        {/* loading：送信中は押せなくする（二重送信を防ぐ） */}
        <Button type="submit" variant="contained" loading={isSubmitting}>
          {isEdit ? "更新" : "登録"}
        </Button>
      </DialogActions>
    </form>
  );
};
