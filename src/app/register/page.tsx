// "use client";

// import { useState } from "react";
// import { Box, Button, Container, TextField, Typography, InputAdornment, CircularProgress } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import EmailIcon from "@mui/icons-material/Email";
// import LockIcon from "@mui/icons-material/Lock";
// import Link from "next/link";
// import { useForm, Controller } from "react-hook-form";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default function RegisterPage() {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (data: any) => {
//     try {
//       setLoading(true);
//       await axios.post(`${API_URL}/auth/register`, data);

//       // Show success pop-up
//       toast.success("Registration successful! Please login.", { position: "top-right" });

//       reset(); // Clear form after successful registration
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || "Registration failed! Please try again.";

//       // Show backend error pop-up
//       toast.error(errorMessage, { position: "top-right" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Toast Container for pop-ups */}
//       <ToastContainer autoClose={3000} hideProgressBar />

//       <Box sx={{ bgcolor: "#1c1e21", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <Container maxWidth="xs" sx={{ bgcolor: "#2a2d32", p: 4, borderRadius: 2, boxShadow: 3 }}>
//           <Typography variant="h4" fontWeight="bold" color="white" textAlign="center" mb={2}>
//             Register
//           </Typography>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             {/* Name Input */}
//             <Controller
//               name="fullName"
//               control={control}
//               defaultValue=""
//               rules={{ required: "Full name is required" }}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   label="Full Name"
//                   variant="outlined"
//                   sx={{ bgcolor: "#333", borderRadius: 1, mb: 1, input: { color: "white" } }}
//                   InputLabelProps={{ style: { color: "white" } }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <PersonIcon sx={{ color: "white" }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   error={!!errors.fullName}
//                   helperText={errors.fullName?.message as string}
//                   onBlur={() => {
//                     const errorMessage = errors.fullName?.message as string;
//                     if (errorMessage) {
//                       toast.error(errorMessage, { position: "top-right" });
//                     }
//                   }}
//                 />
//               )}
//             />

//             {/* Email Input */}
//             <Controller
//               name="email"
//               control={control}
//               defaultValue=""
//               rules={{
//                 required: "Email is required",
//                 pattern: {
//                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                   message: "Invalid email format",
//                 },
//               }}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   label="Email"
//                   variant="outlined"
//                   sx={{ bgcolor: "#333", borderRadius: 1, mb: 1, input: { color: "white" } }}
//                   InputLabelProps={{ style: { color: "white" } }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <EmailIcon sx={{ color: "white" }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   error={!!errors.email}
//                   helperText={errors.email?.message as string}
//                   onBlur={() => {
//                     const errorMessage = errors.email?.message as string;
//                     if (errorMessage) {
//                       toast.error(errorMessage, { position: "top-right" });
//                     }
//                   }}
//                 />
//               )}
//             />

//             {/* Password Input */}
//             <Controller
//               name="password"
//               control={control}
//               defaultValue=""
//               rules={{
//                 required: "Password is required",
//                 minLength: { value: 6, message: "Password must be at least 6 characters long" },
//               }}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   label="Password"
//                   variant="outlined"
//                   type="password"
//                   sx={{ bgcolor: "#333", borderRadius: 1, mb: 2, input: { color: "white" } }}
//                   InputLabelProps={{ style: { color: "white" } }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LockIcon sx={{ color: "white" }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   error={!!errors.password}
//                   helperText={errors.password?.message as string}
//                   onBlur={() => {
//                     const errorMessage = errors.password?.message as string;
//                     if (errorMessage) {
//                       toast.error(errorMessage, { position: "top-right" });
//                     }
//                   }}
//                 />
//               )}
//             />

//             {/* Register Button */}
//             <Button type="submit" fullWidth variant="contained" color="success" sx={{ py: 1.5, fontSize: "16px", borderRadius: 2, mb: 2 }} disabled={loading}>
//               {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Register"}
//             </Button>
//           </form>

//           {/* Login Link */}
//           <Typography color="white" textAlign="center">
//             Already have an account?{" "}
//             <Link href="/login" style={{ color: "#4caf50", fontWeight: "bold", textDecoration: "none" }}>
//               Login here
//             </Link>
//           </Typography>

//           <Typography color="white" textAlign="center">
//             Want to leave?{" "}
//             <Link
//               href="/"
//               style={{
//                 color: "#f44336", // red color for exit
//                 fontWeight: "bold",
//                 textDecoration: "none",
//               }}
//             >
//               Exit
//             </Link>
//           </Typography>
//         </Container>
//       </Box>
//     </>
//   );
// }
"use client";

import { useState } from "react";
import { Box, Button, Container, TextField, Typography, InputAdornment, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"; // import useRouter for redirect

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
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

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000); // Redirect after 2 seconds

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
