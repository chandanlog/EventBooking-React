"use client";
import React,{ useState } from "react";
import { Box, Button, Container, TextField, Typography, InputAdornment, CircularProgress, Snackbar } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import MuiAlert from '@mui/material/Alert';
//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../lib/firebase-config";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to hold the Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success"); // Snackbar severity type
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use environment variable

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Send login request to the backend
      const response = await axios.post(`${API_URL}/auth/login`, data);
      
      // Store token and email in local storage
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("token", response.data.accessToken);

      // Show success Snackbar
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Redirect to dashboard 
        router.push("/dashboard");

    } catch (error: any) {
      // Handle error from backend and show error message
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleGoogleLoginClick = async () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account", // Always ask for account
  });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ Get Firebase ID token
    const idToken = await user.getIdToken();

    // ✅ Store token and user details in localStorage
    localStorage.setItem("token", idToken);
    localStorage.setItem("email", user.email);
    localStorage.setItem("name", user.displayName);
    localStorage.setItem("googleLogin", "true");

    const userData = {
      identifier: user.email,
      providers: user.providerData.map((provider) => provider.providerId),
      created: new Date(user.metadata.creationTime).toISOString().slice(0, 10),
      signedIn: new Date(user.metadata.lastSignInTime).toISOString().slice(0, 10),
      userUID: user.uid,
      userName: user.displayName,
      photoURL: user.photoURL,
    };
    await axios.post(`${API_URL}/auth/storeUser`, userData);

    // ✅ Show success snackbar
    setSnackbarMessage("Google login successful!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    // ✅ Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("Google Login Error:", error.message);

    // ❌ Show error snackbar
    setSnackbarMessage("Google login failed. Try again.");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  }
};


  return (
    <Box sx={{ bgcolor: "#1c1e21", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="xs" sx={{ bgcolor: "#2a2d32", p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="white" textAlign="center" mb={2}>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                variant="outlined"
                sx={{ bgcolor: "#333", borderRadius: 1, mb: 2, input: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />
            )}
          />

          {/* Password Input */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                sx={{ bgcolor: "#333", borderRadius: 1, mb: 3, input: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "white" }} />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password?.message as string}
              />
            )}
          />

          {/* Login Button */}
          <Button type="submit" fullWidth variant="contained" color="success" sx={{ py: 1.5, fontSize: "16px", borderRadius: 2, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
          </Button>
        </form>

        {/* Google Login */}
        <Button
          fullWidth
          variant="outlined"
          sx={{ color: "white", borderColor: "white", py: 1.5, fontSize: "16px", borderRadius: 2, mb: 2 }}
          startIcon={<GoogleIcon sx={{ color: "white" }} />}
          onClick={handleGoogleLoginClick}
        >
          Login with Google
        </Button>

        {/* Register Link */}
        <Typography color="white" textAlign="center">
          New User?{" "}
          <Link href="/register" style={{ color: "#4caf50", fontWeight: "bold", textDecoration: "none" }}>
            Register here
          </Link>
        </Typography>

        {/* Exit Link */}
        <Typography color="white" textAlign="center">
          Want to leave?{" "}
          <Link
            href="/"
            style={{
              color: "#f44336", // red color for exit
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Exit
          </Link>
        </Typography>
      </Container>

      {/* Snackbar for Error/Success messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
