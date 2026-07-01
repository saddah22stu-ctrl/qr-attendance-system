import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AttendancePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Attendance Tracking</Typography>
        <Typography>View and manage real-time attendance records for all lectures.</Typography>
        <Typography sx={{ mt: 2, color: 'textSecondary' }}>
          This page displays live attendance data as students check in using the QR code scanner.
        </Typography>
      </Box>
    </Container>
  );
};

export default AttendancePage;