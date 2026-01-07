import React from "react";
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import { useNavigate } from "react-router-dom";
import "../App.css";
import DashboardCard from "./DashboardCard";
import ActionCard from "./ActionCard";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <Box className="App" sx={{ py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Typography variant="h4" fontWeight={700} gutterBottom>
            School Admin Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Manage teachers, students, and subjects.
          </Typography>

          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Teachers" count="--" />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Students" count="--" />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Subjects" count="--" />
            </Grid>

            {/* <Grid item xs={12} sm={6} md={3}>
              <DashboardCard
                icon={<ClassIcon fontSize="large" />}
                title="Classes"
                count="--"
              />
            </Grid> */}
          </Grid>

          {/* Management Sections */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ActionCard
                title="Teacher Management"
                description="Add, edit, remove teachers and assign subjects."
                onClick={() => navigate("/admin/teachers")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ActionCard
                title="Student Management"
                description="Upload students, assign IDs, and link to classes."
                onClick={() => navigate("/admin/students")}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ActionCard
                title="Subjects"
                description="Create and manage subjects offered by the school."
                onClick={() => navigate("/admin/subjects")}
              />
            </Grid>

             <Grid item xs={12} md={6}>
              <ActionCard
                title="Classes"
                description="Manage classes."
                onClick={() => navigate("/admin/classes")}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default DashboardPage;
