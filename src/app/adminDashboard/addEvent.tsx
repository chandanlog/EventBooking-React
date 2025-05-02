'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { purple } from '@mui/material/colors';

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    eventid: '',
    title: '',
    location: '',
    date: '',
    image: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/admin`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Expected array but got:', data);
        setEvents([]);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpen = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({ ...event });
    } else {
      setEditingEvent(null);
      setFormData({
        eventid: '',
        title: '',
        location: '',
        date: '',
        image: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const endpoint = editingEvent
        ? `${API_URL}/admin/updateEvent`
        : `${API_URL}/admin/addEvent`;

      const method = editingEvent ? 'PUT' : 'POST';

      const payload = editingEvent
        ? formData
        : {
            title: formData.title,
            location: formData.location,
            date: formData.date,
            image: formData.image,
          };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Request failed');
      }

      setSnackbarMessage(editingEvent ? 'Event updated successfully!' : 'Event added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      fetchEvents();

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSnackbarMessage('Failed to save event');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (eventid) => {
    try {
      const response = await fetch(`${API_URL}/admin/deleteEvent/${eventid}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Delete request failed');
      }
  
      setSnackbarMessage('Event deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      fetchEvents();
    } catch (err) {
      console.error('Delete failed:', err);
      setSnackbarMessage('Failed to delete event');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  

  return (
    <Box p={2}>
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" color="#3b0083">Event Tickets</Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              sx={{ bgcolor: "#3b0083", '&:hover': "#3b0083" }}
              onClick={() => handleOpen()}
            >
              Add Event
            </Button>
          </Box>

          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow sx={{ bgcolor: "#3b0083" }}>
                  <TableCell sx={{ color: 'white' }}>Event ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Title</TableCell>
                  <TableCell sx={{ color: 'white' }}>Location</TableCell>
                  <TableCell sx={{ color: 'white' }}>Image</TableCell>
                  <TableCell sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event.eventid} hover>
                      <TableCell>{event.eventid}</TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <img
                          src={event.image}
                          alt="Event"
                          width={80}
                          style={{ borderRadius: 8 }}
                        />
                      </TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleOpen(event)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(event.eventid)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No events found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle color="#3b0083">{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <DialogContent dividers>
          {editingEvent && (
            <TextField
              label="Event ID"
              name="eventid"
              value={formData.eventid}
              fullWidth
              margin="normal"
              disabled
              size="small"
            />
          )}
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            required
            size="small"
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            required
            size="small"
          />
          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: purple[500], '&:hover': { bgcolor: purple[700] } }}
            onClick={handleSubmit}
          >
            {editingEvent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventTable;
