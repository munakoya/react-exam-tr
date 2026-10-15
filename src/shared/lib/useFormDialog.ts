import { useState } from "react";

/**
 * 登録・編集を同じダイアログで行うときの「開閉」と「どれを編集中か」を持つフック
 *
 *   target が undefined → 登録
 *   target に値がある   → 編集
 *
 *   const dialog = useFormDialog<User>();
 *
 *   <Button onClick={dialog.openNew}>登録</Button>
 *   <UserTable onEdit={dialog.openEdit} />
 *   <UserFormDialog open={dialog.open} user={dialog.target} onClose={dialog.close} />
 *
 * 閉じるときは open だけを false にし、target は残す。
 * 閉じるアニメーションの間に、見出しが「編集」→「登録」に変わって見えないようにするため。
 */
export const useFormDialog = <T>() => {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<T>();

  return {
    open,
    target,
    openNew: () => {
      setTarget(undefined);
      setOpen(true);
    },
    openEdit: (item: T) => {
      setTarget(item);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
};
