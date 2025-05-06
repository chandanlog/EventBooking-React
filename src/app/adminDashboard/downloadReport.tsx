import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, IconButton, Tooltip,TextField,
  Table, TableBody, TableCell, TableContainer,TableHead, TableRow, Paper,Pagination,
  CircularProgress, FormControl, InputLabel, Select, MenuItem, Button,Box
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { saveAs } from 'file-saver';

const MonthlyReportDownload = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [events, setEvents] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/getEventReport`);
        const data = await response.json();
        setEvents(data.map(e => ({ ...e, attendees: Number(e.attendees) })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const years = [...new Set(events.map(e => new Date(e.date).getFullYear()))];
  const eventNames = [...new Set(events.map(e => e.name))];
  const handleUserTypeChange = (event) => {
    setSelectedUserType(event.target.value);
  };
  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ];
  const showError = (msg) => {
    setErrorMessage(msg);
    setOpenSnackbar(true);
  };
  const handleFilterSubmit = async () => {
    const currentYear = new Date().getFullYear();
  
    if (!selectedEvent.trim()) {
      showError("Please select an event.");
      return;
    }
    if (!selectedMonth.trim()) {
      showError("Please select a month.");
      return;
    }
    if (!selectedUserType.trim()) {
      showError("Please select a user type.");
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/admin/filteredData`, {
        params: {
          event: selectedEvent === "All Events" ? "" : selectedEvent,
          year: currentYear.toString(),
          month: selectedMonth,
          userType: selectedUserType === "All User Types" ? "" : selectedUserType,
        }
      });
  
      const data = response.data;
  
      if (!data || data.length === 0) {
        showError("No data found for the selected filters.");
        setFilteredData([]);
        return;
      }
  
      setFilteredData(data); // show data in table
    } catch (error) {
      console.error("API error:", error);
      showError("Failed to fetch data.");
    }
  };  
  
  const handleDownloadExcel = () => {
    if (filteredData.length === 0) return;
  
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileBlob, `Filtered_Data_${Date.now()}.xlsx`);
  };
  
  
  const renderCard = (title, data, months) => (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 6,
        backgroundColor: '#f9f9fb',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 10,
          transform: 'scale(1.01)',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <Tooltip title="Download Excel">
          <IconButton onClick={() => downloadExcel(title, months, data)} color="primary">
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </CardContent>
    </Card>
  );

  const downloadExcel = (title, months, data) => {
    const rows = data.map(item => {
      const row = { Category: item.label };
      months.forEach((month, idx) => {
        row[month] = item.data[idx];
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, '_')}.xlsx`);
  };

  const getAggregatedData = () => {
    const months = [...new Set(events.map(e => e.month))];
    const eventNames = [...new Set(events.map(e => e.name))];
    const userTypes = ['individual', 'organization'];
    const states = [...new Set(events.map(e => e.state))];
    const vehicleTypes = [...new Set(events.filter(e => e.userType === 'organization').map(e => e.vehicleType))].filter(Boolean);

    const buildStackedData = (keys, keyField, byEvent = false) => {
      return byEvent
        ? eventNames.flatMap(event =>
            keys.map(key => ({
              label: `${event} - ${key}`,
              data: months.map(month =>
                events.filter(e => e[keyField] === key && e.name === event && e.month === month)
                  .reduce((sum, e) => sum + e.attendees, 0)
              )
            }))
          )
        : keys.map(key => ({
            label: key,
            data: months.map(month =>
              events.filter(e => e[keyField] === key && e.month === month)
                .reduce((sum, e) => sum + e.attendees, 0)
            )
          }));
    };

    return {
      months,
      allEvents: buildStackedData(eventNames, 'name'),
      userTypeAll: buildStackedData(userTypes, 'userType'),
      userTypeSpecific: buildStackedData(userTypes, 'userType', true),
      stateAll: buildStackedData(states, 'state'),
      stateSpecific: buildStackedData(states, 'state', true),
      vehicleAll: buildStackedData(vehicleTypes, 'vehicleType'),
      vehicleSpecific: buildStackedData(vehicleTypes, 'vehicleType', true),
    };
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  const {
    months: allMonths,
    allEvents,
    userTypeAll,
    userTypeSpecific,
    stateAll,
    stateSpecific,
    vehicleAll,
    vehicleSpecific,
  } = getAggregatedData();
  const value = new Date().getFullYear();

  const displayValue = isNaN(value) ? new Date().getFullYear() : value;
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Filter Section */}
      <Card sx={{
        borderRadius: 2,
        boxShadow: 4,
        backgroundColor: '#f9f9fb',
      }}>
  <CardContent>
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Event</InputLabel>
          <Select
            value={selectedEvent}
            label="Event"
            onChange={e => setSelectedEvent(e.target.value)}
          >
            <MenuItem value="All Events">All Events</MenuItem>
            {eventNames.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          type="number"
          value={displayValue}
          label="Year"
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            required
            onChange={e => setSelectedMonth(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {months.map(m => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>User Type</InputLabel>
          <Select
            value={selectedUserType}
            label="User Type"
            onChange={handleUserTypeChange}
            required
          >
            <MenuItem value="All User Types">All User Types</MenuItem>
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="organization">Organization</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
      <Box display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="info"
          onClick={handleFilterSubmit}
        >
          Get Data
        </Button>
      </Box>
    </Grid>
    </Grid>
  </CardContent>
</Card>
<Box mt={3}>
      {filteredData.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: 4,
              backgroundColor: '#f9f9fb',
              maxHeight: 500,
              overflow: 'auto',
            }}
          >
            <Table size="small" aria-label="filtered table">
              <TableHead sx={{ bgcolor: "#3b0083" }}>
                <TableRow>
                  {[
                  "Name",
                  "Ticket No",
                  "Total Seats",
                  "User Type",
                  "Organization",
                  "Event Name",
                  "Event Date",
                  "Location",
                  "User Email",
                  "ID Type",
                  "ID Number",
                  "Mobile",
                  "Status",
                  "Gender",
                  "DOB"
                  ].map((heading, idx) => (
                    <TableCell key={idx} sx={{ color: 'white', py: 0.1 }}>
                      <strong>{heading}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.ticketNo}</TableCell>
                    <TableCell>{row.numSeats}</TableCell>
                    <TableCell>{row.userType}</TableCell>
                    <TableCell>{row.organizationName}</TableCell>
                    <TableCell>{row.eventName}</TableCell>
                    <TableCell>{row.eventDate}</TableCell>
                    <TableCell>{row.eventLoaction}</TableCell>
                    <TableCell>{row.userEmail}</TableCell>
                    <TableCell>{row.idType}</TableCell>
                    <TableCell>{row.idNumber}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>{row.dob}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="secondary"
            />
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
    {filteredData.length > 0 && (
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
      </Box>
    )}
    <Snackbar
      open={openSnackbar}
      autoHideDuration={4000}
      onClose={() => setOpenSnackbar(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity="error" onClose={() => setOpenSnackbar(false)} variant="filled">
        {errorMessage}
      </Alert>
    </Snackbar>

      {/* Original Cards */}
      <Grid container spacing={3} mt={4}>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("All Events", allEvents, allMonths)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("Specific Events", allEvents, allMonths)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("User Type", userTypeAll, allMonths)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("User Type by Event", userTypeSpecific, allMonths)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("State-wise", stateAll, allMonths)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("State-wise by Event", stateSpecific, allMonths)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("Vehicle Types", vehicleAll, allMonths)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderCard("Vehicle by Event", vehicleSpecific, allMonths)}
        </Grid>
      </Grid>
    </div>
  );
};

export default MonthlyReportDownload;
