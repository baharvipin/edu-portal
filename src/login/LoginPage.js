import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  CssBaseline,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value =
      field === "remember" ? event.target.checked : event.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const isValid = validateForm();
    if (!isValid) {
      return; // do not call API if validation fails
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
            remember: formData.remember,
          }),
        },
      );

      const data = await response.json();
      // Temporary log for debugging; remove in production
      // eslint-disable-next-line no-console
      console.log("Login response data:", data);
      console.log("Login response data:", data);
      if (!response.ok) {
        if (data.errors && typeof data.errors === "object") {
          const apiErrors = {};
          Object.keys(data.errors).forEach((key) => {
            apiErrors[key] = Array.isArray(data.errors[key])
              ? data.errors[key][0]
              : data.errors[key];
          });
          setErrors((prev) => ({ ...prev, ...apiErrors }));
        }

        throw new Error(data.message || "Login failed. Please try again.");
      }

      localStorage.setItem("isLoggedIn", "true");

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (typeof data.profileCompleted === "boolean") {
        localStorage.setItem(
          "profileCompleted",
          data.profileCompleted ? "true" : "false",
        );
      }
      if (data.school?.status === "SUSPENDED") {
        navigate("/account/suspended", { replace: true });
        return;
      }

      if (data.school?.status === "DEACTIVATED") {
        navigate("/account/deactivated", { replace: true });
        return;
      }
      if (data.school?.status === "REJECTED") {
        navigate("/school/rejected", { replace: true });
        return;
      }

      if (data.user.userRole === "SUPER_ADMIN") {
        localStorage.setItem("userRole", data.user.userRole);
        navigate("/superadmin/profile", { replace: true });
      } else if (
        data.user.userRole === "ADMIN" &&
        data.school.status === "PROFILE_INCOMPLETE"
      ) {
        localStorage.setItem("userRole", data.user.userRole);
        localStorage.setItem("status", data.school.status);
        navigate("/school/profile", { replace: true });
      } else if (
        data.user.userRole === "ADMIN" &&
        data.school.status === "PROFILE_SUBMITTED"
      ) {
        localStorage.setItem("userRole", data.user.userRole);
        localStorage.setItem("status", data.school.status);
        navigate("/dashboard", { replace: true });
      } else if (
        data.user.userRole === "ADMIN" &&
        data.school.status === "ACTIVE"
      ) {
        // TODO handle other roles or default case
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setApiError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App">
        <Container maxWidth="sm">
          <Paper elevation={6} className="login-card">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
              component="form"
              noValidate
              onSubmit={handleSubmit}
            >
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Welcome back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to access your school portal dashboard.
                </Typography>
              </Box>

              {apiError && (
                <Alert severity="error" onClose={() => setApiError("")}>
                  {apiError}
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  error={!!errors.password}
                  helperText={
                    errors.password ||
                    "At least 8 chars, with uppercase, lowercase and a number"
                  }
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="remember"
                      color="primary"
                      checked={formData.remember}
                      onChange={handleChange("remember")}
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Don&apos;t have an account?{" "}
                <Link component={RouterLink} to="/register" underline="hover">
                  Register Here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default LoginPage;
