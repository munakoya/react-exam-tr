import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 4, textAlign: "center", borderStyle: "dashed" }}
    >
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        {icon ?? <InboxOutlinedIcon color="disabled" sx={{ fontSize: 48 }} />}
        <Typography variant="subtitle1" component="p" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {action && <Stack sx={{ pt: 1 }}>{action}</Stack>}
      </Stack>
    </Paper>
  );
};
