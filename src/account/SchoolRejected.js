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
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import "../App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d32f2f", // Red for rejection
    },
    background: {
      default: "#f3f6fb",
    },
  },
});

function SchoolRejected() {
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
              <CancelOutlinedIcon
                sx={{
                  fontSize: 120,
                  color: "primary.main",
                  opacity: 0.8,
                }}
              />
            </Box>

            <Typography variant="h4" fontWeight={700} color="primary">
              Registration Rejected
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              School Registration Was Not Approved
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Your school registration request has been reviewed and rejected by
              the system administrator.
              <br />
              This may be due to incomplete information, invalid documents, or
              policy constraints.
              <br />
              You may contact support or re-register with correct details.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleGoToLogin}
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default SchoolRejected;
