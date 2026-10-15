// src/app/layouts/RootLayout.tsx
import { Outlet } from "react-router";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export const RootLayout = () => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ユーザー管理
        </Typography>
      </Toolbar>
    </AppBar>
    <main>
      <Outlet />
    </main>
  </>
);
