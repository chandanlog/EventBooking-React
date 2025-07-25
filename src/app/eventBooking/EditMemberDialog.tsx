import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const EditMemberDialog = ({ open, onClose, memberData, updateMember, error, maxMembers, members }) => {
  const [editFormData, setEditFormData] = useState({ ...memberData });

  useEffect(() => {
    setEditFormData({ ...memberData });
  }, [memberData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateMember(editFormData);  // Save updated member data
    onClose();  // Close dialog
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ background: "#1a1a1a", py: 1 , border: "1px solid white", borderRadius: 2}}>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#b388ff" }}
        >
          Edit Member
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Member Name"
              fullWidth
              size="small"
              value={editFormData.name}
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
                value={editFormData.gender}
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
              value={editFormData.dob}
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
                value={editFormData.idType}
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
              value={editFormData.idNumber}
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
              value={editFormData.mobile}
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
          marginRight: "-8px",
          marginLeft: "-8px",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={members.length >= maxMembers || Object.values(error).some((err) => err)}
        >
          Save Changes
        </Button>
      </DialogActions>
    </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
