import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router";
import { EmptyState } from "@/shared/ui";

export const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <EmptyState
        title="ページが見つかりません"
        description="URL を確認してください。"
        action={
          <Button component={RouterLink} to="/" variant="contained">
            トップページへ
          </Button>
        }
      />
    </Container>
  );
};
