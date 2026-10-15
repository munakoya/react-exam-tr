import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useUserStore, type User } from "@/entities/user";
import { UserFormDialog } from "@/features/user-form";
import { useFormDialog } from "@/shared/lib";
import { EmptyState } from "@/shared/ui";
import { UserTable } from "@/widgets/user-table";

// ユーザー一覧ページ（/users）
// ページは「見出し」と「中身」を並べるだけ。一覧やフォームは widgets / features に作ってここに置く
export const UserListPage = () => {
  const users = useUserStore((state) => state.users);

  // 登録・編集ダイアログの開閉と「どのユーザーを編集中か」
  // 「登録」ボタンと表の「編集」ボタンの両方から開くので、ページで持つ
  const dialog = useFormDialog<User>();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* 見出し：左にタイトルと説明、右にメインの操作ボタン（画面が狭いと折り返す） */}
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
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              ユーザー一覧
            </Typography>
            <Typography variant="body2" color="text.secondary">
              名前を押すと詳細を確認できます
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={dialog.openNew}
          >
            ユーザーを登録
          </Button>
        </Stack>

        {/* 中身：0 件なら案内、1 件以上なら表 */}
        {users.length === 0 ? (
          <EmptyState
            title="まだユーザーが登録されていません"
            description="「ユーザーを登録」ボタンから追加してください。"
          />
        ) : (
          <UserTable users={users} onEdit={dialog.openEdit} />
        )}
      </Stack>

      {/* 登録・編集ダイアログ。target がなければ登録、あれば編集になる */}
      <UserFormDialog
        open={dialog.open}
        user={dialog.target}
        onClose={dialog.close}
      />
    </Container>
  );
};
