"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import axios from "axios";
import { json } from 'stream/consumers';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
const API_URL = process.env.NEXT_PUBLIC_API_URL;
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin`);
      let data = await response.data;
      setEvents(data); // Set the events data in state
      localStorage.setItem("events", JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  fetchEvents();
}, []);
  return (
    <Box sx={{ bgcolor: "#1c1e21", color: "white", minHeight: "100vh", py: 5 }}>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: "#64ffda" }}>
          Find & Register for Top Events!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#b0bec5" }}>
          Explore conferences, concerts, and workshops worldwide.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            bgcolor: "white",
            borderRadius: 30,
            "& .MuiOutlinedInput-root": { borderRadius: 30, px: 2 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Container>

      {/* Events Section */}
      <Container>
        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center", mb: 4, color: "#64ffda" }}>
          Upcoming Events
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {filteredEvents.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  bgcolor: "#2c2f33",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  height: "100%",
                  "&:hover": { boxShadow: 6, transform: "scale(1.03)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={event.image}
                  alt={event.title}
                  onError={(e) => (e.currentTarget.src = "/default-event.jpg")}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#64ffda" }}>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "#b0bec5" }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="body2">{event.date}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "#b0bec5" }}>
                    <LocationOnIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="body2">{event.location}</Typography>
                  </Box>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
