"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { usePathname } from 'next/navigation';


// Set your basePath from env or fallback to empty
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const pathname = usePathname();

  const isAdminPage = pathname === '/admin';
  const buttonLabel = isAdminPage ? 'Home' : 'Admin';
  const targetHref = isAdminPage ? '/' : '/admin';

  return (
    <AppBar position="static" sx={{ bgcolor: "#0c0c0c", px: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          href={`${basePath}/`}
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
        <Button
        variant="outlined"
        color="success"
        component={Link}
        href={targetHref}
        sx={{
          borderColor: "#36d576",
          color: "#36d576",
          "&:hover": {
            bgcolor: "#36d576",
            color: "#0c0c0c",
            borderColor: "#36d576",
          },
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        {buttonLabel}
      </Button>
      </Toolbar>
    </AppBar>
  );
};

// Styling
const navStyle = {
  color: "#fff",
  fontSize: "1rem",
  fontWeight: "bold",
  mx: 1,
  "&:hover": { color: "#36d576", transition: "0.3s" },
};

export default Header;
