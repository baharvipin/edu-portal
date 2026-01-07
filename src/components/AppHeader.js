import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleHomePage = () => {
    const status = localStorage.getItem("userRole");
    if (status == "ADMIN") {
      navigate("/dashboard", { replace: true });
    } else if (status == "SUPER_ADMIN") {
      navigate("/superadmin/profile", { replace: true });
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }} onClick={handleHomePage}>
          Education Portal
        </Typography>

        <Box>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
