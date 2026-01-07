import React, { useEffect, useState } from "react";
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
import { parseJwt } from "../utility/commonTask";
import useFetch from "../hooks/useFetch";

function DashboardPage() {
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [classesCount, setClassesCount] = useState(0);

  const token = localStorage.getItem("authToken");
  const tokenDetails = parseJwt(token);
  const navigate = useNavigate();
  const { data: dashboardRes, loading } = useFetch(
    `/api/school/${tokenDetails?.schoolId}/overview`,
  );

  useEffect(() => {
    if (dashboardRes) {
      console.log("result dashboard", dashboardRes);
      setTeacherCount(dashboardRes?.teachers?.length);
      setStudentCount(dashboardRes?.students?.length);
      setSubjectCount(dashboardRes?.subjects?.length);
      setClassesCount(dashboardRes?.classes?.length);
    }
  }, [dashboardRes]);

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
              <DashboardCard title="Teachers" count={teacherCount ?? "--"} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Students" count={studentCount ?? "--"} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Subjects" count={subjectCount ?? "--"} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Classes" count={classesCount ?? "--"} />
            </Grid>
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
