import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import type { User } from "@/entities/user";
import { DeleteUserButton, DeleteUsersButton } from "@/features/delete-user";

/**
 * ユーザーの一覧表（チェックボックスで選択・一括削除・行ごとの編集／削除） ── widgets/user-table/ui
 *
 * widgets には、entities（ユーザーの表示）と features（削除などの操作）を組み合わせた
 * 「大きめの UI のかたまり」を置く。features 同士は import し合えないので、ここで組み合わせる。
 *
 * 一覧に出すのは「名前」と「メールアドレス」だけ。名前を押すと詳細ページ（/users/:userId）へ。
 * 編集ダイアログはページの「登録」ボタンと共用なので、押されたことを onEdit で伝えるだけ。
 *
 *   <UserTable users={users} onEdit={dialog.openEdit} />
 */

type UserTableProps = {
  users: User[];
  /** 編集ボタンが押されたときに、その行のユーザーを渡して呼ばれる */
  onEdit: (user: User) => void;
};

export const UserTable = ({ users, onEdit }: UserTableProps) => {
  // どの行を選んでいるか。この表の中だけで使うので useState（store に入れない）
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 行の削除ボタンで消したユーザーの id が残らないよう、今いるユーザーの id だけにしぼる
  // （state を直すのではなく、表示のたびに計算する）
  const validSelectedIds = selectedIds.filter((id) =>
    users.some((user) => user.id === id),
  );
  const selectedCount = validSelectedIds.length;
  const allSelected = users.length > 0 && selectedCount === users.length;

  // 見出しのチェックボックス：全部選ぶ ⇔ 全部外す
  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : users.map((user) => user.id));

  // 行のチェックボックス：入っていれば外す、なければ足す
  const toggleOne = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  return (
    <Paper variant="outlined">
      {/* 表の上の帯：選んだ件数と一括削除ボタン */}
      <Toolbar
        sx={{
          gap: 2,
          justifyContent: "space-between",
          bgcolor: selectedCount > 0 ? "action.selected" : undefined,
        }}
      >
        <Typography variant="subtitle1" component="p">
          {selectedCount > 0
            ? `${selectedCount}件を選択中`
            : `全${users.length}件`}
        </Typography>
        <DeleteUsersButton
          ids={validSelectedIds}
          onDeleted={() => setSelectedIds([])}
        />
      </Toolbar>

      {/* TableContainer：狭い画面では表だけを横スクロールさせる */}
      <TableContainer>
        <Table size="small" aria-label="ユーザー一覧">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  // indeterminate：一部だけ選んでいるときの「－」の表示
                  indeterminate={selectedCount > 0 && !allSelected}
                  checked={allSelected}
                  onChange={toggleAll}
                  slotProps={{ input: { "aria-label": "すべて選択" } }}
                />
              </TableCell>
              <TableCell>名前</TableCell>
              <TableCell>メールアドレス</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const selected = validSelectedIds.includes(user.id);
              return (
                // selected：選んだ行の背景色を変える
                <TableRow key={user.id} hover selected={selected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected}
                      onChange={() => toggleOne(user.id)}
                      slotProps={{
                        input: { "aria-label": `「${user.name}」を選択` },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ minWidth: 140 }}
                  >
                    {/* 名前を押すと詳細ページへ */}
                    <Link
                      component={RouterLink}
                      to={`/users/${user.id}`}
                      sx={{ fontWeight: 600 }}
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all" }}>
                    {user.email}
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ justifyContent: "flex-end" }}
                    >
                      <Tooltip title="編集">
                        <IconButton
                          aria-label={`「${user.name}」を編集`}
                          onClick={() => onEdit(user)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <DeleteUserButton user={user} />
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
