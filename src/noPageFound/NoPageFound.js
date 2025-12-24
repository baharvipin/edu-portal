import React from 'react';
import { Box, Button, Container, CssBaseline, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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

function NoPageFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        className="App"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <ErrorOutlineIcon
                sx={{
                  fontSize: 120,
                  color: 'primary.main',
                  opacity: 0.7,
                }}
              />
            </Box>

            <Typography variant="h1" fontWeight={700} color="primary">
              404
            </Typography>

            <Typography variant="h5" fontWeight={600} gutterBottom>
              Page Not Found
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
              <br />
              Please check the URL or return to the homepage.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{ mt: 2 }}
            >
              Go to Homepage
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default NoPageFound;

