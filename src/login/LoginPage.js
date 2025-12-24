import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f3f6fb',
    },
  },
});

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const remember = Boolean(data.get('remember'));
    // TODO: Replace with real auth call
    // eslint-disable-next-line no-console
    console.log({ email, password, remember });

    // Simulate successful login
    localStorage.setItem('isLoggedIn', 'true');

    const profileCompleted = localStorage.getItem('profileCompleted') === 'true';

    if (!profileCompleted) {
      navigate('/school/profile', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
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
                display: 'flex',
                flexDirection: 'column',
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

              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={<Checkbox name="remember" color="primary" />}
                  label="Remember me"
                />
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Stack>

              <Button type="submit" variant="contained" size="large">
                Sign In
              </Button>

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Don&apos;t have an account? <Link href="#">Contact admin</Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default LoginPage;

