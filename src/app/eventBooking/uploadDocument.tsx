"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  FormControl,
  FormHelperText,
  Paper,
  InputLabel,
  styled,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

// Custom styled input for file uploads
const Input = styled("input")({
  display: "none",
});
type UploadDocumentProps = {
  onUploadSuccess: () => void;
};

const UploadDocument: React.FC<UploadDocumentProps> = ({ onUploadSuccess }) => {
  const [userType, setUserType] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const [idProof, setIdProof] = useState<File | null>(null);
  const [orgRequestLetter, setOrgRequestLetter] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ idProof?: string; orgRequestLetter?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState(false);
  useEffect(() => {
    const userTypeFromStorage = localStorage.getItem("userType");
    const userEmail = localStorage.getItem("email");
    console.log("User Email: ", userEmail)
    const eventId = localStorage.getItem("eventId");
    if (userTypeFromStorage) {
      setUserType(userTypeFromStorage);
    }
    if (userEmail) {
      console.log("Set User Email: ", userEmail)
      setUserEmail(userEmail);
    }
    if (eventId) {
      setEventId(eventId);
    }
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "idProof" | "orgRequestLetter"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "idProof") {
        setIdProof(file);
      } else if (type === "orgRequestLetter") {
        setOrgRequestLetter(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors: { idProof?: string; orgRequestLetter?: string } = {};

    // Validation
    if (!idProof) {
      formErrors.idProof = "ID Proof is required";
    }
    if (userType === "organization" && !orgRequestLetter) {
      formErrors.orgRequestLetter = "Organization Request Letter is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Simulate API call to Nest.js backend
    setLoading(true);

    const formData = new FormData();
    formData.append("idProof", idProof);
    formData.append("userEmail", userEmail);
    formData.append("eventId",eventId);
    formData.append("userType",userType);
    if (userType === "organization" && orgRequestLetter) {
      formData.append("orgRequestLetter", orgRequestLetter);
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      console.log("formData :",formData);
      const response = await axios.post(`${API_URL}/event/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setSuccessMessage(true);
      setTimeout(() => {
        onUploadSuccess();
      }, 2000);
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle the error
    } finally {
      setLoading(false);
    }
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
       
        bgcolor: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 2,
          borderRadius: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom color="#3b0083">
          Upload Your Documents
        </Typography>
        <Typography variant="body1" mb={3} color="text.secondary">
          Please upload your ID proof. If you're registering as an organization, also upload your
          request letter.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container justifyContent="center" spacing={3} sx={{ fontFamily: "sans-serif" }}>
            <Grid item xs={8}>
              <FormControl fullWidth error={Boolean(errors.idProof)}>
                <InputLabel shrink>Upload ID Proof</InputLabel>
                <label htmlFor="id-proof-upload">
                  <Input
                    id="id-proof-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, "idProof")}
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 1, color: "#3b0083" }}
                  >
                    {idProof ? idProof.name : "Choose ID Proof"}
                  </Button>
                </label>
                <FormHelperText>
                  {errors.idProof || "Upload ID proof document for event booking"}
                </FormHelperText>
              </FormControl>
            </Grid>

            {userType === "organization" && (
              <Grid item xs={8}>
                <FormControl fullWidth error={Boolean(errors.orgRequestLetter)}>
                  <InputLabel shrink>Organization Request Letter</InputLabel>
                  <label htmlFor="org-letter-upload">
                    <Input
                      id="org-letter-upload"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, "orgRequestLetter")}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 1,color: "#3b0083" }}
                    >
                      {orgRequestLetter ? orgRequestLetter.name : "Choose Request Letter"}
                    </Button>
                  </label>
                  {errors.orgRequestLetter && (
                    <FormHelperText>{errors.orgRequestLetter}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  borderRadius: 2,
                  bgcolor: "#3b0083",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  ":hover": { bgcolor: "#290060" },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Next"}
              </Button>
                  
            </Grid>
            {successMessage && (
              <Box textAlign="center" sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: 600 }}>
                  Your Document Upload Successfully!
                </Typography>
              </Box>
            )}
          </Grid>
        </form>
      </Paper>
    </Box>
    </>
  );
};

export default UploadDocument;
