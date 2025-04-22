"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  Divider,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
type PreviewAndSubmitProps = {
  onUreviewSubmit: () => void;
};
const PreviewAndSubmit: React.FC<PreviewAndSubmitProps> = ({ onUreviewSubmit }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(2);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(event.target.checked);
  };

  const eventData = {
    eventName: "Tech Conference 2025",
    eventDate: "May 15, 2025",
    location: "New York City, USA",
    description: "Join us for an exciting day of tech talks and networking with industry leaders.",
    organizer: "Tech Co. Inc.",
    seatsBooked: 3,
  };

  return (
    <>
    <Stepper activeStep={activeStep} alternativeLabel>
      {["Event Details", "Upload Document", "Review & Submit"].map((label, index) => (
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
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        px: { xs: 2, sm: 4, md: 8 },
        background: "linear-gradient(to bottom right, rgba(255,255,255,0.6), rgba(255,255,255,0.3))",
        backdropFilter: "blur(12px)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 4,
          textAlign: "center",
          color: "#3b008",  // Color for heading text
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        Preview Your Ticket
      </Typography>

      <Grid container spacing={4} maxWidth="lg" margin="0 auto">
        {/* Event Ticket Card */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 6,
              p: 3,
              background: "linear-gradient(135deg, #f3f3f3, #ffffff)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ticket Border */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "2px solid #3b008", // Border around the ticket
                borderRadius: 3,
                zIndex: 1,
              }}
            />

            <Typography variant="h6" sx={{ fontWeight: 600, color: "#3b008", mb: 2, zIndex: 2 }}>
              {eventData.eventName}
            </Typography>

            <Divider sx={{ width: "100%", my: 3 }} />

            <Box sx={{ width: "100%", mb: 3, zIndex: 2 }}>
              <Typography sx={{ fontSize: 14, mb: 1, color: "#3b008" }}>
                <strong>Date:</strong> {eventData.eventDate}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 1, color: "#3b008" }}>
                <strong>Location:</strong> {eventData.location}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 1, color: "#3b008" }}>
                <strong>Organizer:</strong> {eventData.organizer}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#3b008" }}>
                <strong>Seats Booked:</strong> {eventData.seatsBooked}
              </Typography>
            </Box>

            {/* Event Description */}
            <Card sx={{ width: "100%", p: 2, background: "rgba(255, 255, 255, 0.8)", borderRadius: 3 }}>
              <Typography variant="body2" sx={{ color: "#3b008" }}>
                <strong>Description:</strong> {eventData.description}
              </Typography>
            </Card>
          </Card>
        </Grid>

        {/* Submit Box */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "#f9f9f9",
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                mb: 3,
                color: "#3b008",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              Confirm & Submit
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, color: "#3b008" }}>
              Ensure all event details are correct. Check the box and submit to confirm your booking.
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={handleCheckboxChange}
                  color="primary"
                  size="small"
                />
              }
              label="Accept Terms"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!acceptedTerms}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: "#3b008",  // Color for the button
                "&:hover": {
                  backgroundColor: "#2a0066",  // Darker shade on hover
                },
              }}
            >
              Submit Booking
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default PreviewAndSubmit;
