import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router";
import type { ReactNode } from "react";
import { theme } from "../styles/theme";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter useTransitions={false}>{children}</BrowserRouter>
    </ThemeProvider>
  );
};
