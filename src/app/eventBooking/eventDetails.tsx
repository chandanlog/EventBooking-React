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
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddMemberModal from "./AddMemberModal";
import { Snackbar, Alert } from '@mui/material';
import Link from "next/link";
import { useRouter } from 'next/router';
import EditMemberDialog from "./EditMemberDialog";


const theme = createTheme({
  palette: {
    primary: {
      main: "#3b0083",
    },
  },
});
type EventDetailsProps = {
  onSubmitSuccess?: () => void;
};

export default function EventDetails({ onSubmitSuccess }: EventDetailsProps) {
  const [activeStep, setActiveStep] = useState(0);
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
const [openSnackbar, setOpenSnackbar] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [openModal, setOpenModal] = useState(false);
const [members, setMembers] = useState([]);
const [submissionSuccess, setSubmissionSuccess] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarColor, setSnackbarColor] = useState<"success" | "error" | "warning" | "info">("success"); // explicitly typing snackbarColor
const [openDialog, setOpenDialog] = useState(false);
const [selectedMember, setSelectedMember] = useState(null);
const [error, setError] = useState({});
useEffect(() => {
  const eventsData = localStorage.getItem("events");
  setEvents(JSON.parse(eventsData))
},[])

  // Validation: Only allow alphanumeric and spaces
  const isValidInput = (value: string) => /^[a-zA-Z0-9\s]*$/.test(value);

  // Format field names for Snackbar message
  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate value
    if (!isValidInput(value)) {
      setSnackbarColor('error');
      setSnackbarMessage(`Special characters are not allowed in ${formatFieldName(name)}`);
      setOpenSnackbar(true);
      return;
    }
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

  useEffect(() => {
    // Fetch data from localStorage if available
    const savedFormData = localStorage.getItem("eventDetails");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);


const API_URL = process.env.NEXT_PUBLIC_API_URL;
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const cleanedData = {
      ...formData,
    };

    console.log("Submitting cleaned data:", cleanedData);

    const response = await axios.post(`${API_URL}/event`, cleanedData);

    localStorage.setItem("eventDetails", JSON.stringify(cleanedData));
    setSnackbarColor('success');
    setSnackbarMessage("Your basic details have been submitted!");
    setOpenSnackbar(true);

    setTimeout(() => {
      setSubmitted(true);
    }, 2000);
  } catch (error) {
    if(error.response){
      const errorMessage = error.response?.data?.message || 'Submission failed. Please try again later.';
      setSnackbarColor('error');
      setSnackbarMessage(errorMessage);
    } else if (error.request) {
      setSnackbarColor('error');
      setSnackbarMessage("No response from server. Please check your connection.");
    } else {
      setSnackbarColor('error');
      setSnackbarMessage("An unexpected error occurred. Please try again.");
    }
    setOpenSnackbar(true);
  }
};


const handleRemove = (index) => {
  const updated = [...members];
  updated.splice(index, 1);
  setMembers(updated);
};
  const handleEditClick = (member) => {
    setSelectedMember(member);
    setOpenDialog(true);
  };

  const updateMember = (updatedMember) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === selectedMember.id ? { ...member, ...updatedMember } : member
      )
    );
  };

const handleOpenModal = () => setOpenModal(true);
const handleCloseModal = () => setOpenModal(false);
const handleSubmitAllMembers = async () => {
  try {
    const response = await axios.post(`${API_URL}/eventmember`, {
      eventId: formData.eventId, // or however you're tracking the event
      members: members,
      userEmail: formData.userEmail,
      userType: formData.userType,
    });
    localStorage.setItem("userType",formData.userType);
    localStorage.setItem("eventId",formData.eventId);
    localStorage.setItem("numSeats",String(formData.numSeats));
    localStorage.setItem("members",JSON.stringify(members));

    setSnackbarColor('success');
    setSnackbarMessage("All members submitted successfully!");
    setOpenSnackbar(true);
    setSubmissionSuccess(true);
    setTimeout(() => {
      onSubmitSuccess();
    }, 2000);
  } catch (error) {
    console.error("Error submitting members:", error);
  }
};
  return (
    <ThemeProvider theme={theme}>
      {/* Form Section */}
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
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)}  severity={snackbarColor} variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
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
                      onClick={() => handleEditClick(member)}
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
          {selectedMember && (
        <EditMemberDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          memberData={selectedMember}
          updateMember={updateMember}
          error={error}
          maxMembers={10}
          members={members}
        />
      )}
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
            >
              Next
            </Button>
          )}
        </Box>
      )}


            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
