import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Button,
  createTheme,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  IconButton,
  Paper,
  Link,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddMemberModal from "./AddMemberModal";
import { Snackbar, Alert } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b0083",
    },
  },
});


// const events = [
//   {
//     title: "React Conf 2025",
//     date: "2025-03-15",
//     location: "San Francisco",
//     image: "https://s3.amazonaws.com/angularminds.com/blog/media/React%20Summit-20240906120708414.png",
//     eventid:"1",
//   },
//   {
//     title: "AI & ML Summit",
//     date: "2025-04-30",
//     location: "New York",
//     image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/Summit%20Poster%20Image.png",
//     eventid:"2",
//   },
//   {
//     title: "Music Fest 2025",
//     date: "2025-03-15",
//     location: "Los Angeles",
//     image: "https://theindianmusicdiaries.com/wp-content/smush-webp/2024/12/Supersonic.jpg.webp",
//     eventid:"3",
//   },
//   {
//     title: "Blockchain Expo",
//     date: "2025-03-15",
//     location: "London",
//     image: "https://blockchain-expo.com/europe/wp-content/uploads/2023/10/MicrosoftTeams-image-41.png",
//     eventid:"4",
//   },
//   {
//     title: "Startup Pitch Day",
//     date: "2025-03-15",
//     location: "Bangalore",
//     image: "https://startupnv.org/wp-content/uploads/2023/08/pitchday.png",
//     eventid:"5",
//   },
//   {
//     title: "Cyber Security Conference",
//     date: "2025-03-15",
//     location: "Dubai",
//     image: "https://events.holyrood.com/wp-content/uploads/2021/10/CyberSecurityScotland_900x517_Header.jpg",
//     eventid:"6",
//   },
// ];

export default function EventDetails() {
  const [formData, setFormData] = useState({
    userType: "",
    eventName: "",
    eventDate: "",
    eventLoaction: "",
    eventId: "",
    numSeats: 1,
    modeOfTravel: "",
    vehicleDetails: "",
    addressLine: "",
    state: "",
    district: "",
    pincode: "",
    country: "India",
    idType: "",
    idNumber: "",
    userEmail: "",
  });
const [events,setEvents] = useState([]);
useEffect(() => {
  const eventsData = localStorage.getItem("events");
  setEvents(JSON.parse(eventsData))
},[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numSeats" ? Number(value) : value,
    }));

    if (name === "userType" && value === "individual") {
      setFormData((prev) => ({
        ...prev,
        numSeats: 1,
        modeOfTravel: "",
        vehicleDetails: "",
      }));
    }
  };
  useEffect(() => {
    let email = localStorage.getItem("email");
    setFormData({...formData, userEmail: email})
  },[])

  useEffect(() => {
    const selectedEvent = events.find(event => event.title === formData.eventName);
    if (selectedEvent) {
      setFormData((prev) => ({
        ...prev,
        eventDate: selectedEvent.date,
        eventLoaction:selectedEvent.location,
        eventId: selectedEvent.eventid,
      }));
    }
  }, [formData.eventName]);

const [openSnackbar, setOpenSnackbar] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [openModal, setOpenModal] = useState(false);
const [members, setMembers] = useState([]);
const [submissionSuccess, setSubmissionSuccess] = useState(false);

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log(formData);
    // Call the backend API to save event form data
    const response = await axios.post(`${API_URL}/event`, formData);
    console.log("Event form data saved successfully:", response.data);

    // If the user type is "organization", proceed to add members
    if (formData.userType === "organization") {
      setSubmitted(true);
    } else {
      console.log("Form Submitted:", formData);
    }
    setOpenSnackbar(true);
  
  setTimeout(() => {
    setSubmitted(true);
  }, 2000);
  } catch (error) {
    console.error("Error saving event form data:", error);
  } 
};  

const handleRemove = (index) => {
  const updated = [...members];
  updated.splice(index, 1);
  setMembers(updated);
};
const handleOpenModal = () => setOpenModal(true);
const handleCloseModal = () => setOpenModal(false);
const handleSubmitAllMembers = async () => {
  try {
    const response = await axios.post(`${API_URL}/eventmember`, {
      eventId: formData.eventId, // or however you're tracking the event
      members: members,
      userEmail: formData.userEmail,
    });
    console.log("All members submitted successfully:", response.data);
    setOpenSnackbar(true); // show success
    setSubmissionSuccess(true);
  } catch (error) {
    console.error("Error submitting members:", error);
  }
};

  return (
    <ThemeProvider theme={theme}>
      {/* Form Section */}
      <Box sx={{ px: 2, pb: 4, display: "flex", justifyContent: "center", bgcolor: "#f7f4fc" }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 5,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            p: 4,
            backgroundColor: "#fff",
          }}
        >
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Event Name */}
                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Event Name</InputLabel>
                    <Select
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      label="Event Name"
                      required
                    >
                      {events.map((event, index) => (
                        <MenuItem key={index} value={event.title}>
                          {event.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Event Date */}
                <Grid item xs={12} sm={3} sx={{ textAlign: "left" }}>
                  <TextField
                    label="Event Date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Grid>

                {/* Event Location */}
                <Grid item xs={12} sm={3} sx={{ textAlign: "left" }}>
                  <TextField
                    label="Event Location"
                    name="eventLocation"
                    value={formData.eventLoaction}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Grid>

                {/* User Type */}
                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>User Type</InputLabel>
                    <Select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      label="User Type"
                      required
                    >
                      <MenuItem value="individual">Individual</MenuItem>
                      <MenuItem value="organization">Organization</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Number of Seats */}
                <Grid item xs={12} sm={3} sx={{ textAlign: "left" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Number of Seats</InputLabel>
                    <Select
                      name="numSeats"
                      value={formData.numSeats}
                      onChange={handleChange}
                      label="Number of Seats"
                      disabled={formData.userType === "individual"}
                      required
                    >
                      {[1, 2, 3, 5, 10, 20, 50].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Event Id */}
                <Grid item xs={12} sm={3} sx={{ textAlign: "left" }}>
                  <TextField
                    label="Event Id"
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Grid>

                {/* Organization Only Fields */}
                {formData.userType === "organization" && (
                  <>
                    <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                      <TextField
                        label="Mode of Travel"
                        name="modeOfTravel"
                        value={formData.modeOfTravel}
                        onChange={handleChange}
                        fullWidth
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                      <TextField
                        label="Vehicle Details"
                        name="vehicleDetails"
                        value={formData.vehicleDetails}
                        onChange={handleChange}
                        fullWidth
                        required
                        size="small"
                      />
                    </Grid>
                  </>
                )}
 {/* ID Proof */}
 <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>ID Proof</InputLabel>
                    <Select
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                      label="ID Proof"
                      required
                    >
                      <MenuItem value="passport">Passport</MenuItem>
                      <MenuItem value="aadhaar">Aadhaar</MenuItem>
                      <MenuItem value="voterId">Voter ID</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <TextField
                    label="ID Number"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    type="text"
                  />
                </Grid>
                {/* Address Fields */}
                <Grid item xs={12} sx={{ textAlign: "left" }}>
                  <TextField
                    label="Address Line"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={2}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <TextField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <TextField
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <TextField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Country</InputLabel>
                    <Select name="country" value={formData.country} disabled label="Country">
                      <MenuItem value="India">India</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* Submit */}
               
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                {!submitted ? (
        <Button
          type="submit"
          variant="contained"
          size="large"
        >
          Next
        </Button>
      ) : (
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenModal}
          disabled={members.length >= formData.numSeats}
        >
          Add Member ({members.length}/{formData.numSeats})
        </Button>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
          Form submitted successfully!
        </Alert>
      </Snackbar>
</Grid>

              </Grid>
              <AddMemberModal
  open={openModal}
  onClose={handleCloseModal}
  members={members}
  setMembers={setMembers}
  maxMembers={formData.numSeats}
/>

{members.length > 0 && (
    <Card
      sx={{
        mt: 4,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#3b0083" }}
        >
          Member Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TableContainer component={Paper} elevation={0}>
          <Table size="small" aria-label="member details table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell><strong>ID Type</strong></TableCell>
                <TableCell><strong>ID Number</strong></TableCell>
                <TableCell><strong>Mobile</strong></TableCell>
                <TableCell><strong>DOB</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index} hover>
                  <TableCell>{member.name || "N/A"}</TableCell>
                  <TableCell>{member.gender?.toUpperCase() || "N/A"}</TableCell>
                  <TableCell>{member.idType?.toUpperCase() || "N/A"}</TableCell>
                  <TableCell>{member.idNumber || "N/A"}</TableCell>
                  <TableCell>{member.mobile || "N/A"}</TableCell>
                  <TableCell>{member.dob || "N/A"}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      sx={{
                        color: "#0288d1",
                        mr: 1,
                        "&:hover": { color: "#01579b" },
                      }}
                      onClick={() => alert("Edit functionality coming soon!")}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: "#e53935",
                        "&:hover": { color: "#b71c1c" },
                      }}
                      onClick={() => handleRemove(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )}

{members.length === formData.numSeats && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          {!submissionSuccess ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 2 }}
              onClick={handleSubmitAllMembers}
            >
              Submit All Members
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 2 }}
              component={Link} href="/uploadimage"
            >
              Next
            </Button>
          )}

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
              All members submitted successfully!
            </Alert>
          </Snackbar>
        </Box>
      )}


            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
