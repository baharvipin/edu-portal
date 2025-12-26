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
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import "../App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f9a825", // Amber / waiting state
    },
    background: {
      default: "#f3f6fb",
    },
  },
});

function SchoolPendingApproval() {
  const navigate = useNavigate();

  const handleLogout = () => {
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
            <HourglassEmptyOutlinedIcon
              sx={{
                fontSize: 120,
                color: "primary.main",
                opacity: 0.8,
              }}
            />

            <Typography variant="h4" fontWeight={700} color="primary">
              Profile Submitted
            </Typography>

            <Typography variant="h6" fontWeight={600}>
              Waiting for Approval
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Your school profile has been successfully submitted.
              <br />
              It is currently under review by the Super Administrator.
              <br />
              You will gain full access once approval is granted.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default SchoolPendingApproval;
