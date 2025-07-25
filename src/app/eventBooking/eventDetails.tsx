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
  StepLabel
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddMemberModal from "./AddMemberModal";
import { Snackbar, Alert } from '@mui/material';
import EditMemberDialog from "./EditMemberDialog";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#b388ff",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#0d0d0d",
      paper: "#c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightBold: 600,
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "#1a1a1a",
          boxShadow: "0 0 20px rgba(179, 136, 255, 0.3)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
        head: {
          backgroundColor: "#2a2a2a",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: "#b388ff", // purple
          color: "#ffffff",           // white text
          "& .MuiAlert-icon": {
            color: "#ffffff",         // white icon
          },
        },
      },
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
    organizationName: "",
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
const [submissionSuccessMembers, setSubmissionSuccessMembers] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarColor, setSnackbarColor] = useState<"success" | "error" | "warning" | "info">("success"); // explicitly typing snackbarColor
const [openDialog, setOpenDialog] = useState(false);
const [selectedMember, setSelectedMember] = useState(null);
const [error, setError] = useState({});
const [stateList, setStateList] = useState([]);
const [districtList, setDistrictList] = useState([]);
const API_URL = process.env.NEXT_PUBLIC_API_URL;
useEffect(() => {
  const eventsData = localStorage.getItem("events");
  const savedDistrictList = localStorage.getItem("districtList");

  if(eventsData){
    setEvents(JSON.parse(eventsData));
  }
  if (savedDistrictList) {
    setDistrictList(JSON.parse(savedDistrictList));
  }
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

  // Fetch all states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/location/states`);
        setStateList(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  // Fetch districts when state changes
 const handleStateChange = async (event: any) => {
    const selectedStateName = event.target.value;
    setFormData({ ...formData, state: selectedStateName, district: "" });

    try {
      const res = await axios.get(
        `${API_URL}/admin/location/districts/${selectedStateName}`
      );
      setDistrictList(res.data);
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  const handleDistrictChange = (event: any) => {
    setFormData({ ...formData, district: event.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const cleanedData = {
      ...formData,
    };

    const response = await axios.post(`${API_URL}/event`, cleanedData);

    localStorage.setItem("eventDetails", JSON.stringify(cleanedData));
    localStorage.setItem("districtList", JSON.stringify(districtList));
    setSnackbarColor('success');
    setSubmissionSuccess(true);
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
      organizationName: formData.organizationName,
    });
    localStorage.setItem("userType",formData.userType);
    localStorage.setItem("organizationName",formData.organizationName);
    localStorage.setItem("eventId",formData.eventId);
    localStorage.setItem("numSeats",String(formData.numSeats));
    localStorage.setItem("members",JSON.stringify(members));

    setSnackbarColor('success');
    setSnackbarMessage("All members submitted successfully!");
    setOpenSnackbar(true);
    setSubmissionSuccessMembers(true);
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
                    color: "primary.main", // default color
                    mb:2,
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "primary.main",
                    fontWeight: "bold",
                    mb:2,
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "primary.main",
                    mb:2,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      <Box sx={{ px: 2, pb: 4, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 5,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            p: 4,
            bgcolor: "background.paper", color: "white",
            border: "1px solid white",
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
                      disabled={submissionSuccess}
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
                      disabled={submissionSuccess}
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
                      disabled={formData.userType === "individual" || submissionSuccess}
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
                {formData.userType === "organization" && (
                <>
                  <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                    <TextField
                      label="Organization Name"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      fullWidth
                      required
                      size="small"
                      disabled={submissionSuccess}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} sx={{ textAlign: "left" }}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel id="mode-of-travel-label">Mode of Travel</InputLabel>
                      <Select
                        labelId="mode-of-travel-label"
                        id="modeOfTravel"
                        name="modeOfTravel"
                        value={formData.modeOfTravel}
                        label="Mode of Travel"
                        onChange={handleChange}
                        disabled={submissionSuccess}
                      >
                        <MenuItem value="bus">Bus</MenuItem>
                        <MenuItem value="train">Train</MenuItem>
                        <MenuItem value="own vehicle">Own Vehicle</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3} sx={{ textAlign: "left" }}>
                    <TextField
                      label="Vehicle Details"
                      name="vehicleDetails"
                      value={formData.vehicleDetails}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={submissionSuccess}
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
                      disabled={submissionSuccess}
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
                    disabled={submissionSuccess}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Country</InputLabel>
                    <Select name="country" value={formData.country} label="Country" disabled={submissionSuccess}>
                      <MenuItem value="India">India</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                <FormControl fullWidth size="small" disabled={submissionSuccess}>
                  <InputLabel>State</InputLabel>
                  <Select
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    required
                  >
                    {stateList.map((stateName) => (
                    <MenuItem key={stateName} value={stateName}>
                      {stateName}
                    </MenuItem>
                  ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: "left" }}>
                <FormControl fullWidth size="small" disabled={submissionSuccess}>
                <InputLabel>District</InputLabel>
                <Select
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  required
                  disabled={!formData.state || submissionSuccess}
                >
                  {districtList.map((district, index) => (
                    <MenuItem key={index} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    disabled={submissionSuccess}
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
                    disabled={submissionSuccess}
                  />
                </Grid>
                {/* Submit */}
               
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                {!submitted ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{color:'white'}}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleOpenModal}
                    disabled={members.length >= formData.numSeats}
                    sx={{color:'white'}}
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
                <Alert onClose={() => setOpenSnackbar(false)}  severity={snackbarColor}  variant="standard" sx={{ width: "100%" }}>
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
        backgroundColor: "background.paper",
        border: "1px solid white",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          Member Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TableContainer component={Paper} elevation={0}>
          <Table size="small" aria-label="member details table">
            <TableHead sx={{color: "primary.main"}}>
              <TableRow sx={{ bgcolor:"background.paper" }}>
                <TableCell sx={{color: "primary.main"}}><strong>Name</strong></TableCell>
                <TableCell sx={{color: "primary.main"}}><strong>Gender</strong></TableCell>
                <TableCell sx={{color: "primary.main"}}><strong>ID Type</strong></TableCell>
                <TableCell sx={{color: "primary.main"}}><strong>ID Number</strong></TableCell>
                <TableCell sx={{color: "primary.main"}}><strong>Mobile</strong></TableCell>
                <TableCell sx={{color: "primary.main"}}><strong>DOB</strong></TableCell>
                <TableCell align="center" sx={{color: "primary.main"}}><strong>Actions</strong></TableCell>
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
          {!submissionSuccessMembers ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 2, color: 'white' }}
              onClick={handleSubmitAllMembers}
            >
              Submit All Members
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 2, color: 'white' }}
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
