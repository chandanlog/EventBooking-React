"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Function to check login status
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth(); // Check auth on mount

    // Listen for changes in localStorage (for multiple tabs)
    const handleStorageChange = () => checkAuth();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Update UI and redirect to home page
    setIsLoggedIn(false);
    router.push("/"); // Redirect to home page
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#0c0c0c", px: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            textDecoration: "none",
            color: "#36d576",
            fontWeight: "bold",
            fontSize: "1.5rem",
            "&:hover": { opacity: 0.8 },
          }}
        >
          EventHub
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Button component={Link} href="/" sx={navStyle}>
            Home
          </Button>
          {isLoggedIn ? (
            <>
              <Button component={Link} href="/dashboard" sx={navStyle}>
                Dashboard
              </Button>
              <Button onClick={handleLogout} sx={navStyle}>
                Logout
              </Button>
            </>
          ) : (
            <Button component={Link} href="/login" sx={navStyle}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Navigation Button Style
const navStyle = {
  color: "#fff",
  fontSize: "1rem",
  fontWeight: "bold",
  mx: 1,
  "&:hover": { color: "#36d576", transition: "0.3s" },
};

export default Header;
