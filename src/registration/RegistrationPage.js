import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

function RegistrationPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      schoolName: data.get('schoolName'),
      board: data.get('board'),
      city: data.get('city'),
      state: data.get('state'),
      schoolEmail: data.get('schoolEmail'),
      adminName: data.get('adminName'),
      adminEmail: data.get('adminEmail'),
      password: data.get('password'),
      system: data.get('system'),
      termsAccepted: Boolean(data.get('termsAccepted')),
    };
    // Replace with real registration call
    // eslint-disable-next-line no-console
    console.log(payload);
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
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  School Registration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide school and admin details to set up your portal access.
                </Typography>
              </Box>

              <Stack spacing={2}>
                <TextField
                  required
                  fullWidth
                  name="schoolName"
                  label="School Name"
                  autoComplete="organization"
                />
                <FormControl fullWidth required>
                  <InputLabel id="board-label">Education Board</InputLabel>
                  <Select
                    labelId="board-label"
                    id="board"
                    name="board"
                    label="Education Board"
                    defaultValue=""
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
                </FormControl>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    required
                    fullWidth
                    name="city"
                    label="City"
                    autoComplete="address-level2"
                  />
                  <TextField
                    required
                    fullWidth
                    name="state"
                    label="State"
                    autoComplete="address-level1"
                  />
                </Stack>
                <TextField
                  required
                  fullWidth
                  name="schoolEmail"
                  label="Official School Email"
                  type="email"
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
                  autoComplete="name"
                />
                <TextField
                  required
                  fullWidth
                  name="adminEmail"
                  label="Admin Email (Username)"
                  type="email"
                  autoComplete="username"
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                />
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
              >
                <FormControlLabel
                  control={<Checkbox name="termsAccepted" color="primary" required />}
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I accept the
                      <Link href="https://www.areraconventschool.com/page/terms-and-condition" underline="hover" target="_blank">
                        Terms &amp; Conditions
                      </Link>
                    </Typography>
                  }
                />
                <Button type="submit" variant="contained" size="large">
                  Register School
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default RegistrationPage;

