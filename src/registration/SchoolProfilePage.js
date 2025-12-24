import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
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
  const [medium, setMedium] = useState('English');
  const [gradingSystem, setGradingSystem] = useState('Grades');
  const [attendanceMode, setAttendanceMode] = useState('Manual');
  const [notifications, setNotifications] = useState('Email');
  const [modules, setModules] = useState({
    exams: true,
    homework: false,
  });
  const [files, setFiles] = useState({
    logo: '',
    regCert: '',
    boardCert: '',
  });

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      ...(registrationData || {}),
      fullAddress: data.get('fullAddress'),
      registrationNumber: data.get('registrationNumber'),
      medium,
      yearEstablished: data.get('yearEstablished'),
      classes: data.get('classes'),
      academicYear: data.get('academicYear'),
      schoolTimings: data.get('schoolTimings'),
      gradingSystem,
      facilities: {
        labs: Boolean(data.get('labs')),
        transport: Boolean(data.get('transport')),
        hostel: Boolean(data.get('hostel')),
      },
      documents: {
        logo: files.logo,
        registrationCertificate: files.regCert,
        boardCertificate: files.boardCert,
      },
      attendanceMode,
      notifications,
      modulesEnabled: modules,
    };
    // Replace with real submit
    // eslint-disable-next-line no-console
    console.log('Profile submit', payload);

    // Mark profile as completed and redirect to dashboard
    localStorage.setItem('profileCompleted', 'true');
    navigate('/dashboard', { replace: true });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App">
        <Container maxWidth="md">
          <Paper elevation={6} className="login-card" sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Complete Your School Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please provide the required information to complete your school profile.
                </Typography>
              </Box>
              <Box sx={{ width: 180 }}>
                <Typography variant="caption" color="text.secondary">
                  60% Complete
                </Typography>
                <LinearProgress variant="determinate" value={60} sx={{ mt: 0.5 }} />
              </Box>
            </Box>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Section title="School Profile">
                <TextField name="fullAddress" label="Full Address" fullWidth required />
                <TextField name="registrationNumber" label="Registration / Affiliation Number" fullWidth required />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
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
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    School Logo
                  </Typography>
                  <Button variant="outlined" onClick={() => logoInput.current?.click()}>
                    Upload Logo
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={logoInput}
                    onChange={(e) => handleFileChange('logo', e)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {files.logo || 'No file chosen'}
                  </Typography>
                </Stack>
              </Section>

              <Section title="Academic Setup">
                <TextField name="classes" label="Classes & Sections" fullWidth required />
                <TextField name="academicYear" label="Academic Year" fullWidth required placeholder="e.g., 2024 - 2025" />
                <TextField name="schoolTimings" label="School Timings" fullWidth required placeholder="e.g., 8:00 AM to 2:00 PM" />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <FormControlLabel control={<Checkbox name="labs" />} label="Laboratories" />
                  <FormControlLabel control={<Checkbox name="transport" />} label="Transport Facility" />
                  <FormControlLabel control={<Checkbox name="hostel" />} label="Hostel Facility" />
                </Stack>
              </Section>

              <Section title="Documents">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 180 }}>
                    Registration Certificate
                  </Typography>
                  <Button variant="outlined" onClick={() => regCertInput.current?.click()}>
                    Upload
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    hidden
                    ref={regCertInput}
                    onChange={(e) => handleFileChange('regCert', e)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {files.regCert ? `Uploaded: ${files.regCert}` : 'No file chosen'}
                  </Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 180 }}>
                    Board Affiliation Certificate
                  </Typography>
                  <Button variant="outlined" onClick={() => boardCertInput.current?.click()}>
                    Upload
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    hidden
                    ref={boardCertInput}
                    onChange={(e) => handleFileChange('boardCert', e)}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {files.boardCert ? `Uploaded: ${files.boardCert}` : 'No file chosen'}
                  </Typography>
                </Stack>
              </Section>

              <Section title="System Configuration">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    Notifications
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={notifications}
                    exclusive
                    onChange={handleToggleChange(setNotifications)}
                    size="small"
                  >
                    <ToggleButton value="Email">Email</ToggleButton>
                    <ToggleButton value="SMS">SMS</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 170 }}>
                    Modules Enabled
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <FormControlLabel
                      control={<Checkbox checked={modules.exams} onChange={handleModuleToggle('exams')} />}
                      label="Exams Module"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={modules.homework} onChange={handleModuleToggle('homework')} />}
                      label="Homework Module"
                    />
                  </Stack>
                </Stack>
              </Section>

              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" size="large">
                  Save &amp; Continue
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

