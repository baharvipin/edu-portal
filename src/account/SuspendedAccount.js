import React from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "../App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f3f6fb",
    },
  },
});

function AccountSuspended() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        className="App"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <ErrorOutlineIcon
                sx={{
                  fontSize: 120,
                  color: "primary.main",
                  opacity: 0.7,
                }}
              />
            </Box>

            <Typography variant="h4" fontWeight={700} color="primary">
              Account Suspended
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Access Restricted
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Your account has been temporarily suspended.
              <br />
              This may be due to policy violations, incomplete verification, or
              administrative action.
              <br />
              Please contact support or try logging in again later.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleGoToLogin}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AccountSuspended;
