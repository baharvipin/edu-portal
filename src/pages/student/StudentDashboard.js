import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Avatar,
  Paper,
  Stack,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

// Icons
import TimerIcon from "@mui/icons-material/Timer";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({});
  const param = useParams();
  console.log("hello", param);

  useEffect(() => {
    const fetchStudentDashboard = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/students/dashboard/${param?.studentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );

        const result = await res.json();

        if (result.success) {
          setStudentData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch student dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDashboard();
  }, []);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading dashboard...</Typography>;
  }

  const student = studentData
    ? {
        fullName: `${studentData.firstName} ${studentData.lastName}`,
        rollNo: studentData.id.slice(0, 8).toUpperCase(), // temp roll no
        grade: `${studentData.class.displayName} - Section ${studentData.section.name}`,
      }
    : {
        fullName: "Loading...",
        rollNo: "--",
        grade: "--",
      };

  const subjects =
    studentData?.studentSubjects?.length > 0
      ? studentData.studentSubjects.map((item) => ({
          name: item.subject.name,
          teacher:
            item.subject.teacherSubjects?.[0]?.teacher?.fullName ||
            "Not Assigned",
          progress: Math.floor(Math.random() * 40) + 60, // placeholder
          color: "#673ab7",
        }))
      : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 1. Header & Profile Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(90deg, #6200ea 0%, #311b92 100%)",
          color: "white",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                border: "4px solid rgba(255,255,255,0.3)",
                bgcolor: "secondary.main",
              }}
              src="/path-to-student-avatar.jpg"
            >
              {student.fullName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold">
              {student.fullName}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1, opacity: 0.9 }}>
              <Typography variant="body2">Roll No: {student.rollNo}</Typography>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">{student.grade}</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" fontWeight="bold">
              {studentData.school.name}
            </Typography>
            <Typography variant="caption">
              {studentData.school.city}, {studentData.school.state}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* 2. Stats Row */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatBox
                title="Attendance"
                value="94%"
                color="#4caf50"
                subtitle="Last 30 days"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatBox
                title="Avg. Grade"
                value="A-"
                color="#ff9800"
                subtitle="Across 6 subjects"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatBox
                title="Completed"
                value="12/15"
                color="#2196f3"
                subtitle="Assignments"
              />
            </Grid>
          </Grid>

          {/* 3. Subject Progress Grid */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            My Courses & Progress
          </Typography>
          {subjects.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              No subjects assigned yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {subjects.map((sub, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <SubjectProgressCard subject={sub} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* 4. Sidebar: Upcoming Deadlines */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Upcoming Deadlines
          </Typography>
          <Paper
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid #eee",
            }}
            elevation={0}
          >
            <List disablePadding>
              <DeadlineItem
                title="Calculus Quiz"
                date="Tomorrow, 10:00 AM"
                type="Exam"
              />
              <DeadlineItem
                title="Physics Lab Report"
                date="Wed, 14 Jan"
                type="Assignment"
              />
              <DeadlineItem
                title="History Essay"
                date="Fri, 16 Jan"
                type="Homework"
              />
            </List>
            <Box sx={{ p: 2, textAlign: "center", bgcolor: "#fcfcfc" }}>
              <Typography
                variant="button"
                color="primary"
                sx={{ cursor: "pointer", fontWeight: "bold" }}
              >
                View Full Calendar
              </Typography>
            </Box>
          </Paper>
 
        </Grid>
      </Grid>
    </Container>
  );
}

/* --- Sub-Components --- */

function StatBox({ title, value, color, subtitle }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #eee",
        textAlign: "center",
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color: color, my: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Paper>
  );
}

function SubjectProgressCard({ subject }) {
  return (
    <Card elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {subject.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subject.teacher}
            </Typography>
          </Box>
          <IconButton size="small">
            <ChevronRightIcon />
          </IconButton>
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant="determinate"
              value={subject.progress}
              sx={{
                height: 8,
                borderRadius: 5,
                bgcolor: "#eee",
                "& .MuiLinearProgress-bar": { bgcolor: subject.color },
              }}
            />
          </Box>
          <Typography variant="body2" fontWeight="bold">
            {subject.progress}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function DeadlineItem({ title, date, type }) {
  return (
    <ListItem divider>
      <ListItemIcon>
        <Avatar
          sx={{
            bgcolor: type === "Exam" ? "#ffebee" : "#e3f2fd",
            color: type === "Exam" ? "#d32f2f" : "#1976d2",
          }}
        >
          {type === "Exam" ? <TimerIcon /> : <AssignmentIcon />}
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={date}
        primaryTypographyProps={{ fontWeight: "bold", variant: "body2" }}
        secondaryTypographyProps={{ variant: "caption" }}
      />
    </ListItem>
  );
}
