import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import { useUserStore, type User } from "@/entities/user";
import { DeleteUserButton } from "@/features/delete-user";
import { UserFormDialog } from "@/features/user-form";
import { formatDate, useFormDialog } from "@/shared/lib";
import { EmptyState } from "@/shared/ui";

/**
 * ユーザーの詳細ページ（/users/:userId） ── pages/user-detail/ui
 *
 * 一覧では名前とメールアドレスだけなので、ここで全ての項目を見せる。
 * 一覧と同じ UserFormDialog・DeleteUserButton を使い回す。
 * 削除したら一覧へ戻る（消したユーザーのページに残らないように）。
 */
export const UserDetailPage = () => {
  // URL の :userId の部分を受け取る
  const { userId } = useParams();
  // find は store の中の同じオブジェクトを返すので、セレクターの中で使っても無限再描画にならない
  const user = useUserStore((state) =>
    state.users.find((item) => item.id === userId),
  );
  const navigate = useNavigate();
  const dialog = useFormDialog<User>();

  // 削除済み・URL の打ち間違いで見つからないとき
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <EmptyState
          title="ユーザーが見つかりません"
          description="削除されたか、URL が間違っています。"
          action={
            <Button component={RouterLink} to="/users" variant="contained">
              ユーザー一覧へ
            </Button>
          }
        />
      </Container>
    );
  }

  // 表示する項目（見出しと値）。任意の項目は、未入力なら "—" を出す
  const items = [
    { term: "名前", description: user.name },
    { term: "年齢", description: `${user.age}歳` },
    { term: "メールアドレス", description: user.email },
    { term: "趣味", description: user.hobby || "—" },
    { term: "登録日", description: formatDate(user.createdAt) },
    { term: "更新日", description: formatDate(user.updatedAt) },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Button
            component={RouterLink}
            to="/users"
            startIcon={<ArrowBackIcon />}
          >
            ユーザー一覧へ戻る
          </Button>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            {user.name}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => dialog.openEdit(user)}
            >
              編集
            </Button>
            <DeleteUserButton
              user={user}
              variant="button"
              // replace：履歴を置き換え、ブラウザの「戻る」で消したページに戻らないようにする
              onDeleted={() => navigate("/users", { replace: true })}
            />
          </Stack>
        </Stack>

        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          {/* dl / dt / dd：見出しと値の組を並べるときの HTML */}
          <Box
            component="dl"
            sx={{
              m: 0,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
              rowGap: { xs: 0.5, sm: 2 },
              columnGap: 2,
            }}
          >
            {items.map((item) => (
              <Box key={item.term} sx={{ display: "contents" }}>
                <Typography
                  component="dt"
                  color="text.secondary"
                  sx={{ fontWeight: 600, pt: { xs: 1.5, sm: 0 } }}
                >
                  {item.term}
                </Typography>
                <Typography
                  component="dd"
                  sx={{ m: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Stack>

      <UserFormDialog
        open={dialog.open}
        user={dialog.target}
        onClose={dialog.close}
      />
    </Container>
  );
};
