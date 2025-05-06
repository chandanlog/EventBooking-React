import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
// Sample report components
import MonthlyReport from './monthlyReport';
import DownloadReport from './downloadReport';
import DailyActivities from './dailyActivities';
//import EventSummaryReport from './EventSummaryReport';  // Assuming EventSummaryReport component exists
//import UserTypeReport from './UserTypeReport';  // Assuming UserTypeReport component exists

const reportCards = [
  {
    title: 'Monthly Report',
    description: 'Track overall event performance month by month.',
    icon: '📈',
    component: <MonthlyReport />, // Corresponding component to render
  },
  {
    title: 'Download Report',
    description: 'Download PDF or Excel reports for record keeping.',
    icon: '📄',
    component: <DownloadReport />, // Uncomment and replace with the actual component if needed
  },
  {
    title: 'Daily Activities',
    description: 'Overview of event activities conducted each day.',
    icon: '📅',
    component: <DailyActivities />, // Uncomment and replace with the actual component if needed
  }  
];

const ReportDashboard = () => {
  const [selectedReport, setSelectedReport] = useState(null);  // Track selected report
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleReportClick = (report) => {
    setSelectedReport(report);  // Set selected report when a button is clicked
  };

  return (
    <Box>
      <Container maxWidth="lg">
        {selectedReport ? (
            <>
              {/* Header row with back button and title */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={() => setSelectedReport(null)}
                  sx={{ position: 'absolute', left: 0, color: '#3b0083' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight={700} color="#3b0083">
                  📊 {selectedReport.title}
                </Typography>
              </Box>
  
              {/* Render selected report component */}
              {selectedReport.component}
            </>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h6" fontWeight={700} color="#3b0083" align='center'>
                📊 Event Report Dashboard 
                </Typography>
            </Grid>
            {reportCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 30px rgba(106, 27, 154, 0.2)',
                    p: 4,
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(106, 27, 154, 0.3)',
                    },
                  }}
                >
                  {/* Ribbon Tag */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: -10,
                      backgroundColor: '#f06292',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    NEW
                  </Box>

                  {/* Glowing Icon */}
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      mx: 'auto',
                      mb: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(145deg, #ba68c8, #f48fb1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 36,
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {card.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#4a148c"
                    gutterBottom
                  >
                    {card.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="#6a1b9a"
                    sx={{ minHeight: 48 }}
                  >
                    {card.description}
                  </Typography>

                  {/* Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleReportClick(card)}  // Handle button click to display the report
                    sx={{
                      mt: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      backgroundColor: '#3b0083',
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: '#4a148c',
                      },
                    }}
                  >
                    View Report
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ReportDashboard;
