"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Grid, FormControl, FormHelperText } from "@mui/material";

const UploadDocument: React.FC = () => {
  const [userType, setUserType] = useState<string>(""); // To hold the user type
  const [idProof, setIdProof] = useState<File | null>(null); // To hold ID proof file
  const [orgRequestLetter, setOrgRequestLetter] = useState<File | null>(null); // To hold Organization Request Letter
  const [errors, setErrors] = useState<{ idProof?: string; orgRequestLetter?: string }>({}); // Error state for validation

  // Fetch user type from localStorage when the component mounts for the first time.
  
  useEffect(() => {
    const userTypeFromStorage = localStorage.getItem("userType");
    if (userTypeFromStorage) {
      setUserType(userTypeFromStorage);
    }
  }, []);

  // Handle file upload for ID Proof
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "idProof" | "orgRequestLetter") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "idProof") {
        setIdProof(file);
      } else if (type === "orgRequestLetter") {
        setOrgRequestLetter(file);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation check
    let formErrors: { idProof?: string; orgRequestLetter?: string } = {};
    if (!idProof) {
      formErrors.idProof = "ID Proof is required";
    }
    if (userType === "Organization" && !orgRequestLetter) {
      formErrors.orgRequestLetter = "Organization Request Letter is required for organizations";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Simulate file upload
    console.log("Files uploaded:", { idProof, orgRequestLetter });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Upload Documents
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.idProof)}>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, "idProof")}
              />
              {errors.idProof && <FormHelperText>{errors.idProof}</FormHelperText>}
            </FormControl>
          </Grid>

          {userType === "Organization" && (
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(errors.orgRequestLetter)}>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, "orgRequestLetter")}
                />
                {errors.orgRequestLetter && <FormHelperText>{errors.orgRequestLetter}</FormHelperText>}
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UploadDocument;
