import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from "@mui/material";

export default function AddMemberModal({
  open,
  onClose,
  members,
  setMembers,
  maxMembers,
}) {
  const [memberData, setMemberData] = React.useState({
    name: "",
    gender: "",
    dob: "",
    idType: "",
    idNumber: "",
    mobile: "",
  });

  const [error, setError] = React.useState({
    name: "",
    idNumber: "",
    mobile: "",
    gender: "",
    dob: "",
    idType: "",
  });

  const MIN_AGE = 5;
  // Validate input to ensure no special characters (only letters, numbers, and spaces)
  const validateInput = (name: string, value: string) => {
    const regex = /^[A-Za-z0-9 ]*$/; // Allows only letters, numbers, and spaces
    if (name === "name" || name === "idNumber" || name === "mobile") {
      if (!regex.test(value)) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} contains invalid characters.`;
      }
    }

    if (name === "mobile" && value.length !== 10) {
      return "Mobile number must be 10 digits long.";
    }

    if (name === "mobile" && !/^[0-9]*$/.test(value)) {
      return "Mobile number must contain only numbers.";
    }

     // Minimum age validation
    if (name === "dob" && value) {
      const dob = new Date(value);
      const age = calculateAge(dob);
      if (age < MIN_AGE) {
        return `Age must be at least ${MIN_AGE} years.`;
      }
    }

    return "";
  };
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value);
    setError((prev) => ({ ...prev, [name]: validationError }));
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    // Check if all required fields are filled out and valid
    let formValid = true;
    const newError = { ...error };

    // Check if any field is empty or invalid
    Object.keys(memberData).forEach((key) => {
      if (!memberData[key]) {
        newError[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
        formValid = false;
      }
    });

    setError(newError);

    // If form is invalid, don't add member
    if (!formValid || members.length >= maxMembers) return;

    setMembers([...members, memberData]);
    setMemberData({
      name: "",
      gender: "",
      dob: "",
      idType: "",
      idNumber: "",
      mobile: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ background: "#1a1a1a", py: 1 , border: "1px solid white", borderRadius: 2}}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#b388ff"}}
        >
          Add Member
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Member Name"
              fullWidth
              size="small"
              value={memberData.name}
              onChange={handleChange}
              variant="outlined"
              required
              error={!!error.name}
              helperText={error.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={memberData.gender}
                onChange={handleChange}
                label="Gender"
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="dob"
              label="Date of Birth"
              fullWidth
              size="small"
              type="date"
              required
              value={memberData.dob}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!error.dob}
              helperText={error.dob}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>ID Type</InputLabel>
              <Select
                name="idType"
                value={memberData.idType}
                onChange={handleChange}
                label="ID Type"
                required
              >
                <MenuItem value="aadhaar">Aadhaar</MenuItem>
                <MenuItem value="passport">Passport</MenuItem>
                <MenuItem value="voterId">Voter ID</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="idNumber"
              label="ID Number"
              fullWidth
              size="small"
              value={memberData.idNumber}
              onChange={handleChange}
              required
              error={!!error.idNumber}
              helperText={error.idNumber}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="mobile"
              label="Mobile Number"
              fullWidth
              size="small"
              value={memberData.mobile}
              onChange={handleChange}
              type="tel"
              required
              error={!!error.mobile}
              helperText={error.mobile}
            />
          </Grid>
        </Grid>
     
      <DialogActions
        sx={{
          backgroundColor: "#1a1a1a",
          justifyContent: "space-between",
          marginRight: "-8px",
          marginLeft: "-8px",
        }}
      >
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          disabled={members.length >= maxMembers || Object.values(error).some((err) => err)}
        >
          Add Member
        </Button>
      </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
