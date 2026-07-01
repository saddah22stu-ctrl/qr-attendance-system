import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ReportsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Reports & Analytics</Typography>
        <Typography>Generate comprehensive attendance reports and analytics.</Typography>
        <Typography sx={{ mt: 2, color: 'textSecondary' }}>
          View attendance statistics, trends, and generate export reports.
        </Typography>
      </Box>
    </Container>
  );
};

export default ReportsPage;