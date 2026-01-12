import React from "react";
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
  const studentData = {};
  const student = studentData?.student || {
    fullName: "Vipin Kumar",
    rollNo: "2024-08",
    grade: "10th - Section A",
  };

  const subjects = studentData?.subjects || [
    {
      name: "Mathematics",
      teacher: "Mr. Raj Kumar",
      progress: 75,
      color: "#673ab7",
    },
    { name: "Physics", teacher: "Dr. Sharma", progress: 60, color: "#2196f3" },
    { name: "English", teacher: "Ms. Anita", progress: 90, color: "#009688" },
  ];

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
            <Chip 
              label="Top 5% of Class"
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: "bold",
              }}
            />
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
          <Grid container spacing={2}>
            {subjects.map((sub, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <SubjectProgressCard subject={sub} />
              </Grid>
            ))}
          </Grid>
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

          {/* School Badge (Integrated) */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              bgcolor: "#f0f4ff",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          > 
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                JNV Ghazipur
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CBSE Affiliated
              </Typography>
            </Box>
          </Box>
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
