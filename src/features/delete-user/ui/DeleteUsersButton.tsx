import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useUserStore } from "@/entities/user";
import { ConfirmDialog } from "@/shared/ui";

/**
 * 選択したユーザーをまとめて削除するボタン ＋ 確認ダイアログ ── features/delete-user/ui
 *
 * 表のチェックボックスで選んだ id を受け取る。選択の state は表（widgets）が持つ。
 *
 *   <DeleteUsersButton ids={selectedIds} onDeleted={() => setSelectedIds([])} />
 */

type DeleteUsersButtonProps = {
  ids: string[];
  /** 削除したあとに呼ばれる（選択を空にする） */
  onDeleted?: () => void;
};

export const DeleteUsersButton = ({ ids, onDeleted }: DeleteUsersButtonProps) => {
  const [open, setOpen] = useState(false);
  const removeUsers = useUserStore((state) => state.removeUsers);

  const handleConfirm = () => {
    setOpen(false);
    removeUsers(ids);
    onDeleted?.();
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteOutlinedIcon />}
        onClick={() => setOpen(true)}
        // 1件も選んでいないときは押せない
        disabled={ids.length === 0}
      >
        選択した{ids.length}件を削除
      </Button>
      <ConfirmDialog
        open={open}
        title={`${ids.length}件を削除しますか？`}
        message={`選択した${ids.length}人のユーザーをまとめて削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
