import React from 'react';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  useTheme,
  useMediaQuery,
  CardActions,
  Button,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);
const MonthlyReport = () => {
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const [events, setEvents] = useState([]);
const [error, setError] = useState(null);

  useEffect(() => {
    // Async function to fetch data
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/getEventReport`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const normalizedData = data.map((e) => ({
            ...e,
            attendees: Number(e.attendees),
          }));
          setEvents(normalizedData);
      } catch (error) {
        setError(error.message); // Capture any errors
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();

  }, []); 
  const getAggregatedData = () => {
    const months = [...new Set(events.map((e) => e.month))];
    const eventNames = [...new Set(events.map((e) => e.name))];
    const userTypes = ['individual', 'organization'];
    const states = [...new Set(events.map((e) => e.state))];
    
    // Filter vehicle types for organization userType only and remove null/empty values
    const vehicleTypes = [...new Set(events.filter(e => e.userType === 'organization').map((e) => e.vehicleType))].filter(vt => vt && vt !== '');
  
    const totalAttendeesPerMonth = months.map((month) =>
      events.filter((e) => e.month === month).reduce((sum, e) => sum + e.attendees, 0)
    );
  
    const buildStackedData = (keyList, filterKey, byEvent = false) => {
      if (!byEvent) {
        return keyList.map((key) => ({
          label: key,
          data: months.map((month) =>
            events.filter((e) => e[filterKey] === key && e.month === month)
              .reduce((sum, e) => sum + e.attendees, 0)
          ),
        }));
      } else {
        return eventNames.flatMap((event) =>
          keyList.map((key) => ({
            label: `${event} - ${key}`,
            data: months.map((month) =>
              events.filter((e) => e[filterKey] === key && e.name === event && e.month === month)
                .reduce((sum, e) => sum + e.attendees, 0)
            ),
          }))
        );
      }
    };
  
    return {
      months,
      totalAttendeesPerMonth,
      monthlyStackedData: buildStackedData(eventNames, 'name'),
      userTypeAllEventsData: buildStackedData(userTypes, 'userType'),
      userTypeSpecificEventData: buildStackedData(userTypes, 'userType', true),
      stateWiseAllData: buildStackedData(states, 'state'),
      stateWiseSpecificData: buildStackedData(states, 'state', true),
      // Only include vehicle data for 'organization' userType
      vehicleAllData: buildStackedData(vehicleTypes, 'vehicleType'),
      vehicleSpecificData: buildStackedData(vehicleTypes, 'vehicleType', true),
    };
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    months,
    totalAttendeesPerMonth,
    monthlyStackedData,
    userTypeAllEventsData,
    userTypeSpecificEventData,
    stateWiseAllData,
    stateWiseSpecificData,
    vehicleAllData,
    vehicleSpecificData,
  } = getAggregatedData();

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false, position: 'top' as const, } },
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  const generateBarData = (labels, datasets) => ({
    labels,
    datasets: datasets.map((data, i) => ({
      ...data,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#BA68C8'][i % 5],
      borderRadius: 5,
    })),
  });

  const generateLineData = (labels, datasets) => ({
    labels,
    datasets: datasets.map((data, i) => ({
      ...data,
      borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#BA68C8'][i % 5],
      backgroundColor: 'transparent',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    })),
  });
  const totalStateBookings = events.reduce((sum, e) => sum + Number(e.attendees || 0), 0);
  const renderChartRow = (title1, chart1, title2, chart2) => (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography fontWeight={600} mb={1}>{title1}</Typography>
          <Box sx={{ height: 300 }}>{chart1}</Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography fontWeight={600} mb={1}>{title2}</Typography>
          <Box sx={{ height: 300 }}>{chart2}</Box>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ py: 4, background: '#f9fbfd', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {renderChartRow(
          '📅 Total Attendees per Month',
          <Bar data={generateBarData(months, [{ label: 'Total Attendees', data: totalAttendeesPerMonth }])} options={chartOptions} />,
          '📅 Total Attendees per Month',
          <Line data={generateLineData(months, monthlyStackedData)} options={chartOptions} />
        )}

        {renderChartRow(
          '👥 User Type - All Events',
          <Bar data={generateBarData(months, userTypeAllEventsData)} options={chartOptions} />,
          '👥 User Type - Specific Events',
          <Line data={generateLineData(months, userTypeSpecificEventData)} options={chartOptions} />
        )}

        {renderChartRow(
          '🌍 State-wise Booking - All Events',
          <Bar data={generateBarData(months, stateWiseAllData)} options={chartOptions} />,
          '🌍 State-wise Booking - Specific Events',
          <Line data={generateLineData(months, stateWiseSpecificData)} options={chartOptions} />
        )}

        {renderChartRow(
          '🚗 Vehicle Type Booking - All Events',
          <Bar data={generateBarData(months, vehicleAllData)} options={chartOptions} />,
          '🚗 Vehicle Type Booking - Specific Events',
          <Line data={generateLineData(months, vehicleSpecificData)} options={chartOptions} />
        )}
        <Typography variant="h6" fontWeight={700} mt={5} mb={2} color="#3b0083">
        📌 Total Bookings Summary
        </Typography>

        <Grid container spacing={2}>
        {/* Total Bookings (All Events) */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6" color="#3b0083">Total Bookings (All Events)</Typography>
            <Box display="flex" justifyContent="center" my={1}>
                <Typography variant="h6" fontWeight="bold">
                {events.reduce((sum, e) => sum + Number(e.attendees), 0)}
                </Typography>
            </Box>
            </Card>
        </Grid>

        {/* Bookings by Event */}
        {[...new Set(events.map(e => e.name))].map((eventName, idx) => {
            const total = events
            .filter(e => e.name === eventName)
            .reduce((sum, e) => sum + Number(e.attendees), 0);

            return (
            <Grid item xs={12} sm={6} md={4} key={`event-${idx}`}>
                <Card sx={{ p: 2, backgroundColor: '#fce4ec' }}>
                <Typography variant="subtitle2" color="#3b0083" fontWeight="bold" ></Typography>
                <Typography variant="h6" color="#3b0083" align="center">{eventName}</Typography>
                <Box display="flex" justifyContent="center" my={1}>
                    <Typography variant="h6" fontWeight="bold">{total}</Typography>
                </Box>
                </Card>
            </Grid>
            );
        })}

        {/* Bookings by User Type */}
        {[...new Set(events.map(e => e.userType))].map((userType, idx) => {
            const total = events
            .filter(e => e.userType === userType)
            .reduce((sum, e) => sum + Number(e.attendees), 0);

            return (
            <Grid item xs={12} sm={6} md={4} key={`user-${idx}`}>
                <Card sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
                <Typography variant="h6" color="#3b0083" align="center">User Type : {userType}</Typography>
                <Box display="flex" justifyContent="center" my={1}>
                    <Typography variant="h6" fontWeight="bold">{total}</Typography>
                </Box>
                </Card>
            </Grid>
            );
        })}

        {/* Total Bookings by All States */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
            <Typography variant="h6" color="#3b0083" align="center">Total Bookings (All States)</Typography>
            <Box display="flex" justifyContent="center" my={1}>
                <Typography variant="h6" fontWeight="bold">{totalStateBookings}</Typography>
            </Box>
            </Card>
        </Grid>

        {/* Vehicle Type Cards */}
        {[...new Set(events.map(e => e.vehicleType).filter(v => v && v.trim() !== ""))].map((vehicle, idx) => {
            const total = events
            .filter(e => e.vehicleType === vehicle)
            .reduce((sum, e) => sum + Number(e.attendees), 0);

            return (
            <Grid item xs={12} sm={6} md={4} key={`vehicle-${idx}`}>
                <Card sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                <Typography variant="h6" color="#3b0083" align="center">Vehicle Type : {vehicle}</Typography>
                <Box display="flex" justifyContent="center" my={1}>
                    <Typography variant="h6" fontWeight="bold">{total}</Typography>
                </Box>
                </Card>
            </Grid>
            );
        })}
        </Grid>
      </Container>
    </Box>
  );
};

export default MonthlyReport;
