import { jaJP } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme(
  {
    palette: {
      primary: { main: "#4f46e5" },
      secondary: { main: "#0d9488" },
      error: { main: "#dc2626" },
      warning: { main: "#d97706" },
      success: { main: "#16a34a" },
      background: {
        default: "#f8f9fb",
        paper: "#ffffff",
      },
    },

    shape: { borderRadius: 8 },

    typography: {
      fontFamily:
        'system-ui, -apple-system, "Segoe UI", "Hiragino Sans", "Meiryo", sans-serif',
      button: { textTransform: "none", fontWeight: 600 },
    },

    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiCard: { defaultProps: { variant: "outlined" } },
      MuiPaper: {
        styleOverrides: { outlined: { borderColor: "#e2e4e9" } },
      },
      MuiTableCell: {
        styleOverrides: { head: { fontWeight: 700, whiteSpace: "nowrap" } },
      },
    },
  },
  jaJP,
);
