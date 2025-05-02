'use client';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => setShowSnackbar(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSnackbar]);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    } else {
      setEmailError('');
    }

    try {
      const res = await fetch(`${API_URL}/admin-user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminEmail",email);
        setMessage('Login successful!');
        setIsError(false);
        setShowSnackbar(true);
        setTimeout(() => {
          setShowSnackbar(false);
          router.push('/adminDashboard');
        }, 1500);
      } else {
        setMessage(data.message || 'Invalid email or password');
        setIsError(true);
        setShowSnackbar(true);
      }
    } catch (err) {
      setMessage('Something went wrong');
      setIsError(true);
      setShowSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #1f1f1f, #000000)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: { xs: 2, sm: 4 },
        pt: { xs: 4, sm: 6 },
      }}
    >
      <Typography
        variant="h2"
        fontSize={{ xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }}
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}
      >
        Welcome to EventHub
      </Typography>

      <Typography
        variant="h6"
        fontSize={{ xs: '0.9rem', sm: '1rem', md: '1.1rem' }}
        sx={{ mt: 2, color: '#ccc', textAlign: 'center' }}
      >
        Seamlessly manage and book events with ease.
      </Typography>

      <Paper
        elevation={10}
        sx={{
          mt: { xs: 6, sm: 8 },
          p: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          background: 'linear-gradient(to right, #14b8a6, #06b6d4)',
          color: 'white',
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Admin Access
        </Typography>
        <Typography sx={{ mt: 1 }}>
          Log in to manage events and bookings from the dashboard.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
            '&:hover': {
              background: 'linear-gradient(to right, #4f46e5, #2563eb)',
            },
          }}
          onClick={() => setIsOpen(true)}
        >
          Admin Login
        </Button>
      </Paper>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth="xs"
        scroll="body"
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#6b21a8' }}>
          Admin Login
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <DialogActions sx={{ px: 0 }}>
              <Button
                onClick={() => setIsOpen(false)}
                color="error"
                variant="outlined"
                size="small"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
                  },
                  color: 'white',
                  fontWeight: 500,
                }}
              >
                Login
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={isError ? 'error' : 'success'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
