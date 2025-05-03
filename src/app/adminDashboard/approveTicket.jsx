'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  InputBase,
  Select,
  MenuItem,
  Paper,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const ApproveTicket = () => {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [eventBookings, setEventBookings] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/adminApprove`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType: "organization" }),
        });

        const data = await res.json();
        const grouped = data.reduce((acc, curr) => {
          const event = curr.eventName;
          if (!acc[event]) acc[event] = [];
          acc[event].push({
            ...curr,
            name: curr.userEmail.split("@")[0],
          });
          return acc;
        }, {});
        setEventBookings(grouped);
        const firstEvent = Object.keys(grouped)[0];
        if (firstEvent) setSelectedEvent(firstEvent);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchEvents();
  }, []);

  const getFileUrl = (file, name = "document") => {
    if (!file || !file.data) return { url: null, filename: null };
  
    const byteArray = new Uint8Array(file.data);
  
    const signature = byteArray.slice(0, 4).join(" ");
    let mimeType = "application/octet-stream"; // fallback
  
    if (signature.startsWith("255 216")) mimeType = "image/jpeg";
    else if (signature.startsWith("137 80 78 71")) mimeType = "image/png";
    else if (signature.startsWith("208 207 17 224")) mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (signature.startsWith("37 80 68 70")) mimeType = "application/pdf";
    else if (signature.startsWith("80 75 3 4")) mimeType = "application/zip";
  
    const extension = mimeType.split("/").pop(); // e.g., 'pdf', 'jpeg'
    const filename = `${name}.${extension}`;
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);
  
    return { url, filename };
  };  

  const handleApproval = async (id, eventId, eventName, userEmail, status) => {
    try {
      const res = await fetch(`${API_URL}/admin/updateStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, eventId, eventName, userEmail, status }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setEventBookings((prev) => {
        const updated = { ...prev };
        updated[eventName] = updated[eventName].map((b) =>
          b.id === id ? { ...b, status } : b
        );
        return updated;
      });
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const currentBookings = eventBookings[selectedEvent] || [];
  const filteredBookings = currentBookings.filter((booking) =>
    booking.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box p={2} width="100%">
    <Card sx={{ boxShadow: 3, borderRadius: 3 }} p={1}>
      <Typography variant="h6" fontWeight="bold" m={1} color="#3b0083">
        Event Booking Approvals
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" p={1}>
        <Grid item xs={12} sm={4}>
          <Select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            fullWidth
            displayEmpty
          >
            {Object.keys(eventBookings).map((event) => (
              <MenuItem key={event} value={event}>
                {event}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              height: 38,
              px: 1,
              boxShadow: 1,
            }}
          >
            <InputBase
              placeholder="Search name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ flex: 1, fontSize: 14 }}
            />
            <IconButton type="button" size="small">
              <Search fontSize="small" />
            </IconButton>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            size="small"
            fullWidth
          >
            {[5, 10, 20].map((n) => (
              <MenuItem key={n} value={n}>
                {n} / page
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* Table */}
      <Box sx={{ overflowX: "auto" }} p={1}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#3b0083" , color:"white"}} >
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white' }}>ID Proof</TableCell>
              <TableCell sx={{ color: 'white' }}>Request Letter</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.userEmail}</TableCell>
                <TableCell>{b.phone}</TableCell>
                <TableCell>
                  {b.idProof && b.idProof.data ? (
                    (() => {
                      const { url, filename } = getFileUrl(b.idProof, "idProof");
                      return url ? (
                        <a href={url} download={filename} target="_blank" rel="noreferrer" style={{
                          textDecoration: "none",
                          backgroundColor: "#3b0083",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                        }}>
                          View
                        </a>
                      ) : (
                        "NA"
                      );
                    })()
                  ) : (
                    "NA"
                  )}
                </TableCell>
                <TableCell>
                  {b.orgRequestLetter && b.orgRequestLetter.data ? (
                    (() => {
                      const { url, filename } = getFileUrl(b.orgRequestLetter, "requestLetter");
                      return url ? (
                        <a href={url} download={filename} target="_blank" rel="noreferrer" style={{
                          textDecoration: "none",
                          backgroundColor: "#3b0083",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                        }}>
                          View
                        </a>
                      ) : (
                        "NA"
                      );
                    })()
                  ) : (
                    "NA"
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      b.status === "approve"
                        ? "green"
                        : b.status === "reject"
                        ? "red"
                        : "orange",
                  }}
                >
                  {b.status}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() =>
                      handleApproval(b.id, b.eventId, b.eventName, b.userEmail, "approve")
                    }
                    disabled={b.status === "approve"}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleApproval(b.id, b.eventId, b.eventName, b.userEmail, "reject")
                    }
                    disabled={b.status === "reject"}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="space-between" mt={2} p={1} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Typography variant="body2">
          Page {currentPage} of {totalPages || 1}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Box>
      </Card>
    </Box>
  );
};

export default ApproveTicket;
