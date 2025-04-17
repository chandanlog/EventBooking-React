"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventDetails from "../eventBooking/eventDetails";

export default function DashboardPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/");
  };

  return (
    <Box sx={{ bgcolor: "#f4f4f9", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ bgcolor: "#3b0083", boxShadow: 5 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
            Event Dashboard
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar sx={{ bgcolor: "#fff" }}>
              <AccountCircleIcon color="primary" />
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ textAlign: "center", mt: 4, maxWidth: "800px" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: "#3b0083" }}>
          Event Booking Form
        </Typography>

        {/* ✅ Stepper with Custom Color */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {["Event Details", "Upload Image", "Review & Submit"].map((label, index) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "#9e9e9e", // default color
                    mb:2,
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "#3b0083",
                    fontWeight: "bold",
                    mb:2,
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "#3b0083",
                    mb:2,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <EventDetails />
      </Container>
    </Box>
  );
}
