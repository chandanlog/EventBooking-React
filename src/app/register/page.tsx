"use client";
import React from 'react';
import { useState } from "react";
import { Box, Button, Container, TextField, Typography, InputAdornment, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"; 
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../lib/firebase-config";
import GoogleIcon from "@mui/icons-material/Google";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State to control Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State to hold the Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");
  const router = useRouter(); // initialize the router for redirection

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Send POST request to the backend for registration
      const response = await axios.post(`${API_URL}/auth/register`, data);
      console.log("Register API Success:", response.data);

      // Check response status and show success message
      if (response.status === 200 || response.status === 201) {
        toast.success("Registration successful! Please login.", { position: "top-right" });

        // Redirect to login page after 1 seconds
        setTimeout(() => {
          router.push("/login");
        }, 1000); // Redirect after 1 seconds

        reset(); // Clear form after successful registration
      } else {
        toast.error("Unexpected server response. Please try again.", { position: "top-right" });
      }
    } catch (error: any) {
      console.log("Register API Error:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Registration failed! Please try again.";
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setLoading(false);
    }
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
    <>
      {/* Toast Container for pop-ups */}
      <ToastContainer autoClose={3000} hideProgressBar />

      <Box sx={{ bgcolor: "#1c1e21", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Container maxWidth="xs" sx={{ bgcolor: "#2a2d32", p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="white" textAlign="center" mb={2}>
            Register
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Input */}
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              rules={{
                required: "Full name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Regex for allowing only alphabets and spaces
                  message: "Name should contain only alphabets and spaces",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  sx={{
                    bgcolor: "#333",
                    borderRadius: 1,
                    mb: 2,
                    input: { color: "white" },
                    '& .MuiInputLabel-root': { color: "white" },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message as string}
                />
              )}
            />

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
                  sx={{
                    bgcolor: "#333",
                    borderRadius: 1,
                    mb: 2,
                    input: { color: "white" },
                    '& .MuiInputLabel-root': { color: "white" },
                  }}
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
                minLength: { value: 6, message: "Password must be at least 6 characters long" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  sx={{
                    bgcolor: "#333",
                    borderRadius: 1,
                    mb: 3,
                    input: { color: "white" },
                    '& .MuiInputLabel-root': { color: "white" },
                  }}
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

            {/* Register Button */}
            <Button type="submit" fullWidth variant="contained" color="success" sx={{ py: 1.5, fontSize: "16px", borderRadius: 2, mb: 3 }} disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register"}
            </Button>
          </form>
          <Button
          fullWidth
          variant="outlined"
          sx={{ color: "white", borderColor: "white", py: 1.5, fontSize: "16px", borderRadius: 2, mb: 2 }}
          startIcon={<GoogleIcon sx={{ color: "white" }} />}
          onClick={handleGoogleLoginClick}
        >
          Login with Google
        </Button>
          {/* Login Link */}
          <Typography color="white" textAlign="center">
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#4caf50", fontWeight: "bold", textDecoration: "none" }}>
              Login here
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
      </Box>
    </>
  );
}
