"use client";

import { Box, Typography, Link, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#0c0c0c", color: "#fff", py: 4 }}>
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        {/* Footer Links */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 2 }}>
          <Link href="/" sx={footerLinkStyle}>
            Home
          </Link>
          <Link href="/about" sx={footerLinkStyle}>
            About Us
          </Link>
          <Link href="/contact" sx={footerLinkStyle}>
            Contact
          </Link>
          <Link href="/privacy" sx={footerLinkStyle}>
            Privacy Policy
          </Link>
        </Box>

        {/* Copyright */}
        <Typography variant="body2">
          © {new Date().getFullYear()} EventHub. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

// Footer Link Style
const footerLinkStyle = {
  color: "#36d576",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "0.9rem",
  "&:hover": { textDecoration: "underline" },
};

export default Footer;
