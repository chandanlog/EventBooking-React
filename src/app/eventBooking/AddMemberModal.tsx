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

export default function AddMemberModal({ open, onClose, members, setMembers, maxMembers }) {
  const [memberData, setMemberData] = React.useState({
    name: "",
    gender: "",
    dob: "",
    idType: "",
    idNumber: "",
    mobile: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    if (members.length >= maxMembers) return;
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
      <DialogContent sx={{ background: "#f3f6f9", py: 1 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#3b0083" }}
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
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#f3f6f9",
          px: 3,
          pb: 2,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          disabled={members.length >= maxMembers}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}
