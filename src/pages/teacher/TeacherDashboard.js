import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  Paper,
  Stack,
} from "@mui/material";

// Icons
import BookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import BusinessIcon from "@mui/icons-material/Business";

export default function TeacherDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const { teacherId } = useParams();

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/teachers/dashboard/${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    )
      .then((res) => res.json())
      .then(setDashboard);
  }, [teacherId]);

  if (!dashboard) {
    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        <LinearProgress />
        <Typography align="center" sx={{ mt: 2, color: "text.secondary" }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  const { teacher, summary, myClasses, pendingActions, recentActivities } =
    dashboard;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight="800" gutterBottom>
          Welcome back, {teacher.fullName} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is a summary of your academic activities and school details.
        </Typography>
      </Box>
      <Box sx={{ mb: 5 }}>
        <SchoolDetails school={teacher.school ?? {}} />
      </Box>

      <Grid container spacing={4}>
        {/* Quick Stats */}
        <Grid item xs={12} md={12}>
          <StatCard
            title="Total Subjects"
            value={summary.subjectsCount}
            icon={<BookIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        {/* <Grid item xs={12} md={6}>
          <StatCard
            title="Total Students"
            value={summary.studentsCount}
            color="#2e7d32"
          />  
        </Grid> */}

        {/* My Subjects Grid */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Current Subjects
          </Typography>
          <Grid container spacing={3}>
            {myClasses.length === 0 ? (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No subjects assigned yet.
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              myClasses.map(({ subject }) => (
                <Grid item xs={12} sm={6} md={4} key={subject.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          <BookIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {subject.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Code: {subject.code}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        label={subject.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={subject.isActive ? "success" : "default"}
                        variant="soft"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>

        {/* Action Items & Recent Activity */}
        {/* <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Action Required
          </Typography>
          <Stack spacing={2}>
            <StatCard
              title="Attendance Pending"
              value={pendingActions.attendancePending}
              icon={<AssignmentIcon />}
              color="#ed6c02"
              small
            />
            <StatCard
              title="Assignments to Review"
              value={pendingActions.assignmentsToReview}
              color="#d32f2f"
              small
            />
          </Stack>
        </Grid> */}

        {/* <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Recent Activities
          </Typography>
          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "grey.100", color: "grey.600" }}>
                        <HistoryIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={activity} 
                        primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  );
}

/* ---------- Sub-Components ---------- */

function StatCard({ title, value, icon, color, small = false }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: small ? 2 : 3,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: `linear-gradient(135deg, ${color}05 0%, ${color}15 100%)`,
        border: "1px solid",
        borderColor: `${color}30`,
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="500">
          {title}
        </Typography>
        <Typography
          variant={small ? "h5" : "h3"}
          fontWeight="800"
          sx={{ color: color }}
        >
          {value}
        </Typography>
      </Box>
      <Avatar
        sx={{
          bgcolor: color,
          width: small ? 40 : 56,
          height: small ? 40 : 56,
          boxShadow: `0px 4px 10px ${color}40`,
        }}
      >
        {icon}
      </Avatar>
    </Paper>
  );
}

function SchoolDetails({ school }) {
  if (!school) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Side: Avatar/Logo */}
        <Grid item>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              boxShadow: "0 8px 16px rgba(25, 118, 210, 0.2)",
              fontSize: 40,
            }}
          >
            {school.name.charAt(0)}
          </Avatar>
        </Grid>

        {/* Middle: Primary Info */}
        <Grid item xs={12} sm>
          <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4" fontWeight="800" color="text.primary">
              {school.name}
            </Typography>
            {school.isActive && (
              <VerifiedIcon color="primary" sx={{ fontSize: 28 }} />
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={school.board}
              color="secondary"
              size="small"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
            <Typography variant="body2" color="text.secondary">
              • School ID: {school.id.split("-")[0].toUpperCase()}
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {/* Location */}
            <Grid item sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {school.city}, {school.state}
              </Typography>
            </Grid>

            {/* Email */}
            <Grid item sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {school.email}
              </Typography>
            </Grid>

            {/* System Type */}
            <Grid item sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BusinessIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {school.system || "Standard Education System"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Side: Status Badge */}
        <Grid item sx={{ textAlign: "right" }}>
          <Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              gutterBottom
            >
              INSTITUTION STATUS
            </Typography>
            <Chip
              label={school.isActive ? "ACTIVE" : "INACTIVE"}
              color={school.isActive ? "success" : "error"}
              sx={{
                fontWeight: "bold",
                px: 2,
                borderRadius: "8px",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, opacity: 0.6 }} />

      <Typography variant="caption" color="text.secondary" fontStyle="italic">
        Registered School under the {school.board} Board Authority.
      </Typography>
    </Paper>
  );
}
