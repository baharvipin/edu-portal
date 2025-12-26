import React from "react";
import { Box, Container, CssBaseline, Paper, Typography } from "@mui/material";
import "../App.css";

function DashboardPage() {
  return (
    <>
      <CssBaseline />
      <Box className="App">
        <Container maxWidth="md">
          <Paper elevation={6} className="login-card">
            <Typography variant="h5" fontWeight={700} gutterBottom>
              School Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Profile is completed. This is a placeholder dashboard page.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default DashboardPage;
