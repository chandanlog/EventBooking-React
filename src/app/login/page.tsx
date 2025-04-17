"use client";

import { useState } from "react";
import { Box, Button, Container, TextField, Typography, InputAdornment, CircularProgress } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use environment variable

  const onSubmit = async (data: any) => {
    try {
      console.log("data", data)
      setLoading(true);
      console.log("API URL", API_URL)
      const response = await axios.post(`${API_URL}/auth/login`, data);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("token", response.data.accessToken);
      
      toast.success("Login successful!", { autoClose: 2000 });
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
          onClick={() => toast.info("🔹 Google login coming soon!")}
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
      </Container>
    </Box>
  );
}
