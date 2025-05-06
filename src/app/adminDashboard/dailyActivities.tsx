import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const DailyActivities = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Daily Activities
        </Typography>
        <Typography variant="h6" color="text.secondary">
          🚀 Coming Soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          This section is under development and will be available soon.
        </Typography>
      </Paper>
    </Container>
  );
};

export default DailyActivities;
