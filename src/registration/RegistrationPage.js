import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../App.css";

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

function RegistrationPage() {
  const [formData, setFormData] = useState({
    schoolName: "",
    board: "",
    city: "",
    state: "",
    schoolEmail: "",
    adminName: "",
    adminEmail: "",
    password: "",
    system: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    // School Name validation
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "School Name is required";
    } else if (formData.schoolName.trim().length < 3) {
      newErrors.schoolName = "School Name must be at least 3 characters";
    }

    // Board validation
    if (!formData.board) {
      newErrors.board = "Education Board is required";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // School Email validation
    if (!formData.schoolEmail.trim()) {
      newErrors.schoolEmail = "Official School Email is required";
    } else if (!validateEmail(formData.schoolEmail)) {
      newErrors.schoolEmail = "Please enter a valid email address";
    }

    // Admin Name validation
    if (!formData.adminName.trim()) {
      newErrors.adminName = "Admin Name is required";
    } else if (formData.adminName.trim().length < 2) {
      newErrors.adminName = "Admin Name must be at least 2 characters";
    }

    // Admin Email validation
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "Admin Email is required";
    } else if (!validateEmail(formData.adminEmail)) {
      newErrors.adminEmail = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Terms validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Clear API errors when user makes changes
    if (apiError) {
      setApiError("");
    }
    if (apiSuccess) {
      setApiSuccess("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");
    setApiSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const payload = {
      schoolName: formData.schoolName.trim(),
      board: formData.board,
      city: formData.city.trim(),
      state: formData.state.trim(),
      schoolEmail: formData.schoolEmail.trim(),
      adminName: formData.adminName.trim(),
      adminEmail: formData.adminEmail.trim(),
      password: formData.password,
      system: formData.system.trim() || null,
      termsAccepted: formData.termsAccepted,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from API
        if (data.errors && typeof data.errors === "object") {
          const apiErrors = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = Array.isArray(data.errors[key])
              ? data.errors[key][0]
              : data.errors[key];
          });
          setErrors(apiErrors);
        }
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setApiSuccess(data.message || "School registered successfully!");
      // Reset form on success
      setFormData({
        schoolName: "",
        board: "",
        city: "",
        state: "",
        schoolEmail: "",
        adminName: "",
        adminEmail: "",
        password: "",
        system: "",
        termsAccepted: false,
      });
    } catch (error) {
      setApiError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App">
        <Container maxWidth="md">
          <Paper elevation={6} className="login-card">
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  School Registration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide school and admin details to set up your portal access.
                </Typography>
              </Box>

              {apiError && (
                <Alert severity="error" onClose={() => setApiError("")}>
                  {apiError}
                </Alert>
              )}

              {apiSuccess && (
                <Alert severity="success" onClose={() => setApiSuccess("")}>
                  {apiSuccess}
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  name="schoolName"
                  label="School Name"
                  value={formData.schoolName}
                  onChange={handleChange("schoolName")}
                  error={!!errors.schoolName}
                  helperText={errors.schoolName}
                  autoComplete="organization"
                />
                <FormControl fullWidth required error={!!errors.board}>
                  <InputLabel id="board-label">Education Board</InputLabel>
                  <Select
                    labelId="board-label"
                    id="board"
                    name="board"
                    label="Education Board"
                    value={formData.board}
                    onChange={handleChange("board")}
                  >
                    <MenuItem value="">
                      <em>Select board</em>
                    </MenuItem>
                    <MenuItem value="CBSE">CBSE</MenuItem>
                    <MenuItem value="ICSE">ICSE</MenuItem>
                    <MenuItem value="State Board">State Board</MenuItem>
                    <MenuItem value="IB">IB</MenuItem>
                    <MenuItem value="Cambridge">Cambridge</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.board && (
                    <FormHelperText>{errors.board}</FormHelperText>
                  )}
                </FormControl>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    required
                    fullWidth
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleChange("city")}
                    error={!!errors.city}
                    helperText={errors.city}
                    autoComplete="address-level2"
                  />
                  <TextField
                    required
                    fullWidth
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={handleChange("state")}
                    error={!!errors.state}
                    helperText={errors.state}
                    autoComplete="address-level1"
                  />
                </Stack>
                <TextField
                  required
                  fullWidth
                  name="schoolEmail"
                  label="Official School Email"
                  type="email"
                  value={formData.schoolEmail}
                  onChange={handleChange("schoolEmail")}
                  error={!!errors.schoolEmail}
                  helperText={errors.schoolEmail}
                  autoComplete="email"
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Admin (Login User)
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="adminName"
                  label="Admin Name"
                  value={formData.adminName}
                  onChange={handleChange("adminName")}
                  error={!!errors.adminName}
                  helperText={errors.adminName}
                  autoComplete="name"
                />
                <TextField
                  required
                  fullWidth
                  name="adminEmail"
                  label="Admin Email (Username)"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleChange("adminEmail")}
                  error={!!errors.adminEmail}
                  helperText={errors.adminEmail}
                  autoComplete="username"
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  error={!!errors.password}
                  helperText={
                    errors.password ||
                    "Must be at least 8 characters with uppercase, lowercase, and number"
                  }
                  autoComplete="new-password"
                />
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <FormControl error={!!errors.termsAccepted}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="termsAccepted"
                        color="primary"
                        checked={formData.termsAccepted}
                        onChange={handleChange("termsAccepted")}
                        required
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        I accept the{" "}
                        <Link
                          href="https://www.areraconventschool.com/page/terms-and-condition"
                          underline="hover"
                          target="_blank"
                        >
                          Terms &amp; Conditions
                        </Link>
                      </Typography>
                    }
                  />
                  {errors.termsAccepted && (
                    <FormHelperText sx={{ ml: 0 }}>
                      {errors.termsAccepted}
                    </FormHelperText>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register School"
                  )}
                </Button>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="end"
              >
                <Link component={RouterLink} to="/login" underline="hover">
                  Already have an account? Login Here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default RegistrationPage;
