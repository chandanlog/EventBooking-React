"use client";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
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
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const PreviewAndSubmit = ({ onUreviewSubmit }) => {
  const [successMessage, setSuccessMessage] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(2);
  const [eventData, setEventData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [seatsBooked, setSeatsBooked] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState(null);
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const storedEvents = localStorage.getItem("events");
    const storedEventId = localStorage.getItem("eventId");
    const storedUserType = localStorage.getItem("userType");
    const storedNumSeats = localStorage.getItem("numSeats");
    const storedMembers = localStorage.getItem("members");

    setEmail(email);
    setEventId(storedEventId);
    if (storedUserType) setUserType(storedUserType);
    if (storedNumSeats) setSeatsBooked(storedNumSeats);
    if (storedMembers) setMembers(JSON.parse(storedMembers));

    if (storedEvents && storedEventId) {
      const eventsArray = JSON.parse(storedEvents);
      const selectedEvent = eventsArray.find(
        (event) => event.eventid === parseInt(storedEventId, 10)
      );

      if (selectedEvent) {
        setEventData({
          ...selectedEvent,
          userType: storedUserType,
          seatsBooked: storedNumSeats,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!eventData || members.length === 0) return;

    const formDataString = `
🎫 EventHub Ticket Preview
========================
Event       : ${eventData.title}
Date        : ${eventData.date}
Location    : ${eventData.location}
User Type   : ${eventData.userType}
Seats Booked: ${eventData.seatsBooked}

👥 Members List:
${members.map((m, i) => 
`------------------------
#${i + 1}
Name     : ${m.name}
Gender   : ${m.gender}
DOB      : ${m.dob}
ID Type  : ${m.idType.toUpperCase()}
ID No.   : ${m.idNumber}
Mobile   : ${m.mobile}`
).join("\n")}

========================
✅ Thank you for booking!
`;

    QRCode.toDataURL(formDataString)
      .then((url) => setQrCode(url))
      .catch((err) => console.error("Failed to generate QR Code:", err));
  }, [eventData, members]);

  const handleCheckboxChange = (event) => {
    setAcceptedTerms(event.target.checked);
  };
  
  const handleSubmit = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    formData.append("userEmail", email);
    formData.append("eventId",eventId);
    formData.append("qrCode",qrCode);
    formData.append("userType",userType);
    try {
      const response = await axios.post(`${API_URL}/event/finalSubmit`, formData);
      console.log("Event form data saved successfully:", response.data);
      setSuccessMessage(true);
      setTimeout(() => {
        onUreviewSubmit();
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (!eventData) {
    return (
      <Typography variant="h6" sx={{ mt: 10, textAlign: "center", color: "#9e9e9e" }}>
        Loading event data...
      </Typography>
    );
  }

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {["Event Details", "Upload Document", "Review & Submit"].map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": { color: "#9e9e9e", mb: 2 },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "#3b0083",
                  fontWeight: "bold",
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "#3b0083",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: "100vh", py: 4, px: { xs: 2, sm: 4, md: 8 } }}>
        {/* Event Ticket Preview Card */}
        <Grid container justifyContent="center">
          <Grid item xs={12} md={9}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 6,
                p: 4,
                background: "#ffffff",
                border: "3px dashed #ab47bc",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                  color: "#6a1b9a",
                  mb: 3,
                  textTransform: "uppercase",
                }}
              >
                {eventData.title}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#4a148c" }}>
                    <strong>Date:</strong> {eventData.date}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#4a148c" }}>
                    <strong>Location:</strong> {eventData.location}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#4a148c" }}>
                    <strong>Organizer:</strong> EventHub
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "#4a148c" }}>
                    <strong>Booking Type:</strong> {userType}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#4a148c" }}>
                    <strong>Seats Booked:</strong> {seatsBooked}
                  </Typography>
                  {qrCode && (
                    <Box mt={2} textAlign="center">
                      <img src={qrCode} alt="QR Code" width={120} height={120} />
                    </Box>
                  )}
                </Grid>
              </Grid>

              {members.length > 0 && (
                <Box mt={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#6a1b9a", fontWeight: 600, mb: 2 }}
                  >
                    👥 Member Details
                  </Typography>
                  <TableContainer component={Paper} elevation={2}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f3e5f5" }}>
                          <TableCell sx={{ fontSize: "0.75rem" }}>#</TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>Name</TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>Gender</TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>DOB</TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>ID Type</TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>ID No.</TableCell>
                          <TableCell sx={{ fontSize: "0.75rem" }}>Mobile</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {members.map((m, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{i + 1}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{m.name}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{m.gender}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{m.dob}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{m.idType.toUpperCase()}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{m.idNumber}</TableCell>
                            <TableCell sx={{ fontSize: "0.75rem" }}>{m.mobile}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Typography variant="body2" sx={{ mt: 3, fontStyle: "italic", color: "#6a1b9a" }}>
                "A grand event showcasing technological innovation and leadership from all EventHub."
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Confirm & Submit Card (new row) */}
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
  <Grid item xs={12} md={6} lg={4}>
    <Card
      sx={{
        px: 4,
        py: 5,
        borderRadius: 5,
        backdropFilter: "blur(10px)",
        background: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <Typography
        variant="h5"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: "#6a1b9a",
        }}
      >
        🎉 Ready to Go!
      </Typography>

      <Typography
        variant="body1"
        align="center"
        sx={{ color: "#4a148c", mb: 3 }}
      >
        Double-check your details. If everything looks good, hit submit!
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={acceptedTerms}
            onChange={handleCheckboxChange}
            sx={{ color: "#6a1b9a" }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: "#6a1b9a" }}>
            I agree to the terms & conditions
          </Typography>
        }
      />

      <Button
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        disabled={!acceptedTerms}
        sx={{
          mt: 3,
          py: 1,
          fontSize: "1rem",
          fontWeight: 500,
          background: "#8e24aa",
          color: "#fff",
          transition: "0.3s",
          borderRadius: "30px",
          "&:hover": {
            background: "#6a1b9a",
            boxShadow: "0 4px 20px rgba(138, 43, 226, 0.4)",
            transform: "translateY(-2px)",
          },
        }}
      >
        ✅ Submit Booking
      </Button>
      {successMessage && (
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 600 }}>
          ✅ Booking Submitted Successfully!
        </Typography>
        <Typography variant="body2" sx={{ color: "#4caf50" }}>
          Redirecting to confirmation page...
        </Typography>
      </Box>
    )}
    </Card>
  </Grid>
</Grid>
</Box>
    </>
  );
};

export default PreviewAndSubmit;
