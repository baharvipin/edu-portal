import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";

function DashboardCard({ icon, title, count }) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 2,
      }}
    >
      {icon}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {count}
        </Typography>
      </Box>
    </Paper>
  );
}

export default DashboardCard;
