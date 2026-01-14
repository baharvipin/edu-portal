import React, { useState, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { showToast } from "../utility/toastService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f3f6fb",
    },
  },
});

function Section({ title, children }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>{children}</Stack>
    </Paper>
  );
}

function SchoolProfilePage({ registrationData }) {
  const navigate = useNavigate();

  const [medium, setMedium] = useState("English");
  const [gradingSystem, setGradingSystem] = useState("Grades");
  const [attendanceMode, setAttendanceMode] = useState("Manual");
  const [notificationMode, setNotificationMode] = useState("Email");
  const [modules, setModules] = useState({
    exams: true,
    homework: false,
  });
  const [files, setFiles] = useState({
    logo: "",
    regCert: "",
    boardCert: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const logoInput = useRef(null);
  const regCertInput = useRef(null);
  const boardCertInput = useRef(null);

  const handleFileChange = (key, event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file.name }));
    }
  };

  const handleToggleChange = (setter) => (_, value) => {
    if (value !== null) setter(value);
  };

  const handleModuleToggle = (key) => (event) => {
    setModules((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const validateForm = (formValues) => {
    const newErrors = {};

    if (!formValues.fullAddress.trim()) {
      newErrors.fullAddress = "Full Address is required";
    }

    if (!formValues.registrationNumber.trim()) {
      newErrors.registrationNumber =
        "Registration / Affiliation Number is required";
    }

    if (!formValues.yearEstablished.trim()) {
      newErrors.yearEstablished = "Year of Establishment is required";
    } else {
      const year = Number(formValues.yearEstablished);
      const currentYear = new Date().getFullYear();
      if (Number.isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.yearEstablished = `Enter a valid year between 1800 and ${currentYear}`;
      }
    }

    if (!formValues.classes.trim()) {
      newErrors.classes = "Classes & Sections is required";
    }

    if (!formValues.academicYear.trim()) {
      newErrors.academicYear = "Academic Year is required";
    }

    if (!formValues.schoolTimings.trim()) {
      newErrors.schoolTimings = "School Timings is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    setApiSuccess("");

    const data = new FormData(event.currentTarget);

    const requiredValues = {
      fullAddress: (data.get("fullAddress") || "").toString(),
      registrationNumber: (data.get("registrationNumber") || "").toString(),
      yearEstablished: (data.get("yearEstablished") || "").toString(),
      classes: (data.get("classes") || "").toString(),
      academicYear: (data.get("academicYear") || "").toString(),
      schoolTimings: (data.get("schoolTimings") || "").toString(),
    };

    if (!validateForm(requiredValues)) {
      return;
    }

    setLoading(true);

    const payload = {
      fullAddress: requiredValues.fullAddress.trim(),
      registrationNumber: requiredValues.registrationNumber.trim(),
      medium,
      yearEstablished: Number(requiredValues.yearEstablished.trim()),
      classes: requiredValues.classes.trim(),
      academicYear: requiredValues.academicYear.trim(),
      schoolTimings: requiredValues.schoolTimings.trim(),
      gradingSystem: gradingSystem || "Grades",
      facilities: {
        labs: Boolean(data.get("labs")),
        transport: Boolean(data.get("transport")),
        hostel: Boolean(data.get("hostel")),
      },
      documents: {
        logo: files?.logo || "",
        registrationCertificate: files?.regCert || "",
        boardCertificate: files?.boardCert || "",
      },
      attendanceMode: attendanceMode || "Manual",
      notificationMode: notificationMode || "Email",
      modulesEnabled: modules || { exams: true, homework: false },
    };

    try {
      const authToken = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/school/complete-profile`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        },
      );

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        // eslint-disable-next-line no-console
        console.error("Non-JSON response:", text);
        throw new Error(
          `Server error (${response.status}): ${text || "Unknown error"}`,
        );
      }

      if (!response.ok) {
        if (result.errors && typeof result.errors === "object") {
          const apiErrors = {};
          Object.keys(result.errors).forEach((key) => {
            apiErrors[key] = Array.isArray(result.errors[key])
              ? result.errors[key][0]
              : result.errors[key];
          });
          setErrors((prev) => ({ ...prev, ...apiErrors }));
        }
        throw new Error(
          result.message ||
            result.error ||
            `Server error (${response.status}). Please try again.`,
        );
      }

      setApiSuccess(result.message || "School profile saved successfully!");

      showToast(
        result.message || "School profile saved successfully!",
        "success",
      );

      localStorage.setItem("profileCompleted", "true");
      localStorage.setItem("status", "PROFILE_SUBMITTED");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error submitting profile:", error);
      setApiError(
        error.message ||
          "An unexpected error occurred. Please check the console for details.",
      );
      showToast(error.message || "Failed to save profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App">
        <Container maxWidth="md">
          <Paper
            elevation={6}
            className="login-card"
            sx={{ p: 3, borderRadius: 2 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Complete Your School Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please provide the required information to complete your
                  school profile.
                </Typography>
              </Box>
              <Box sx={{ width: 180 }}>
                <Typography variant="caption" color="text.secondary">
                  60% Complete
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={60}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
              {apiError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {apiError}
                </Alert>
              )}
              {apiSuccess && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  {apiSuccess}
                </Alert>
              )}

              <Section title="School Profile">
                <TextField
                  name="fullAddress"
                  label="Full Address"
                  fullWidth
                  required
                  error={!!errors.fullAddress}
                  helperText={errors.fullAddress}
                />
                <TextField
                  name="registrationNumber"
                  label="Registration / Affiliation Number"
                  fullWidth
                  required
                  error={!!errors.registrationNumber}
                  helperText={errors.registrationNumber}
                />
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    Medium of Instruction
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={medium}
                    exclusive
                    onChange={handleToggleChange(setMedium)}
                    size="small"
                  >
                    <ToggleButton value="English">English</ToggleButton>
                    <ToggleButton value="Hindi">Hindi</ToggleButton>
                    <ToggleButton value="Both">Both</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <TextField
                  name="yearEstablished"
                  label="Year of Establishment"
                  type="number"
                  inputProps={{ min: 1800, max: new Date().getFullYear() }}
                  fullWidth
                  required
                  error={!!errors.yearEstablished}
                  helperText={errors.yearEstablished}
                />
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    School Logo
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => logoInput.current?.click()}
                  >
                    Upload Logo
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={logoInput}
                    onChange={(e) => handleFileChange("logo", e)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {files.logo || "No file chosen"}
                  </Typography>
                </Stack>
              </Section>

              <Section title="Academic Setup">
                <TextField
                  name="classes"
                  label="Classes & Sections"
                  fullWidth
                  required
                  error={!!errors.classes}
                  helperText={errors.classes}
                />
                <TextField
                  name="academicYear"
                  label="Academic Year"
                  fullWidth
                  required
                  placeholder="e.g., 2024 - 2025"
                  error={!!errors.academicYear}
                  helperText={errors.academicYear}
                />
                <TextField
                  name="schoolTimings"
                  label="School Timings"
                  fullWidth
                  required
                  placeholder="e.g., 8:00 AM to 2:00 PM"
                  error={!!errors.schoolTimings}
                  helperText={errors.schoolTimings}
                />
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    Grading System
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={gradingSystem}
                    exclusive
                    onChange={handleToggleChange(setGradingSystem)}
                    size="small"
                  >
                    <ToggleButton value="Grades">Grades</ToggleButton>
                    <ToggleButton value="Marks">Marks</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Section>

              <Section title="Infrastructure & Facilities">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <FormControlLabel
                    control={<Checkbox name="labs" />}
                    label="Laboratories"
                  />
                  <FormControlLabel
                    control={<Checkbox name="transport" />}
                    label="Transport Facility"
                  />
                  <FormControlLabel
                    control={<Checkbox name="hostel" />}
                    label="Hostel Facility"
                  />
                </Stack>
              </Section>

              <Section title="Documents">
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 180 }}>
                    Registration Certificate
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => regCertInput.current?.click()}
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    hidden
                    ref={regCertInput}
                    onChange={(e) => handleFileChange("regCert", e)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {files.regCert
                      ? `Uploaded: ${files.regCert}`
                      : "No file chosen"}
                  </Typography>
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 180 }}>
                    Board Affiliation Certificate
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => boardCertInput.current?.click()}
                  >
                    Upload
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    hidden
                    ref={boardCertInput}
                    onChange={(e) => handleFileChange("boardCert", e)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {files.boardCert
                      ? `Uploaded: ${files.boardCert}`
                      : "No file chosen"}
                  </Typography>
                </Stack>
              </Section>

              <Section title="System Configuration">
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    Attendance Mode
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={attendanceMode}
                    exclusive
                    onChange={handleToggleChange(setAttendanceMode)}
                    size="small"
                  >
                    <ToggleButton value="Manual">Manual</ToggleButton>
                    <ToggleButton value="RFID">RFID</ToggleButton>
                    <ToggleButton value="Biometric">Biometric</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    Notifications
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={notificationMode}
                    exclusive
                    onChange={handleToggleChange(setNotificationMode)}
                    size="small"
                  >
                    <ToggleButton value="Email">Email</ToggleButton>
                    <ToggleButton value="SMS">SMS</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    Modules Enabled
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={modules.exams}
                          onChange={handleModuleToggle("exams")}
                        />
                      }
                      label="Exams Module"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={modules.homework}
                          onChange={handleModuleToggle("homework")}
                        />
                      }
                      label="Homework Module"
                    />
                  </Stack>
                </Stack>
              </Section>

              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Save & Continue"
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default SchoolProfilePage;
