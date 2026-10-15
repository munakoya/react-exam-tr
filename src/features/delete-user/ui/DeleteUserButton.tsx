import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useUserStore, type User } from "@/entities/user";
import { ConfirmDialog } from "@/shared/ui";

/**
 * 「削除」ボタン ＋ 確認ダイアログ ── features/delete-user/ui
 *
 * 押す → 確認 → 消す、までをこの部品が持つ。
 *   一覧の行：<DeleteUserButton user={user} />                      … アイコンのボタン
 *   詳細ページ：<DeleteUserButton user={user} variant="button" onDeleted={…} /> … 文字のボタン
 */

type DeleteUserButtonProps = {
  user: User;
  variant?: "icon" | "button";
  /** 削除したあとに呼ばれる（詳細ページなら一覧へ戻る） */
  onDeleted?: () => void;
};

export const DeleteUserButton = ({
  user,
  variant = "icon",
  onDeleted,
}: DeleteUserButtonProps) => {
  // ダイアログの開閉は、このボタンの中だけで使うので useState で持つ（store に入れない）
  const [open, setOpen] = useState(false);
  const removeUser = useUserStore((state) => state.removeUser);

  const handleConfirm = () => {
    setOpen(false);
    removeUser(user.id);
    onDeleted?.();
  };

  return (
    <>
      {variant === "icon" ? (
        <Tooltip title="削除">
          {/* アイコンだけのボタンは、aria-label で何のボタンかを伝える（読み上げ用） */}
          <IconButton
            aria-label={`「${user.name}」を削除`}
            color="error"
            onClick={() => setOpen(true)}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlinedIcon />}
          onClick={() => setOpen(true)}
        >
          削除
        </Button>
      )}
      <ConfirmDialog
        open={open}
        title="削除しますか？"
        message={`「${user.name}」を削除します。この操作は取り消せません。`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
