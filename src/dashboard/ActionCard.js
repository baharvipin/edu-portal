import React from "react";
import { Paper, Typography, Button } from "@mui/material";

function ActionCard({ title, description, onClick }) {
  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      <Button variant="contained" onClick={onClick}>
        Manage
      </Button>
    </Paper>
  );
}

export default ActionCard;