import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  Dialog,
  TextField,
  Box
} from '@mui/material';
import axios from 'axios';

const LecturesPage = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    date: '',
    startTime: '',
    endTime: '',
    qrDuration: 15,
    room: ''
  });

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/lectures', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLectures(response.data.lectures || []);
    } catch (error) {
      console.error('Error loading lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLecture = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/lectures', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenDialog(false);
      loadLectures();
    } catch (error) {
      console.error('Error creating lecture:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'info';
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Lectures Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Create Lecture
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Create New Lecture</Typography>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Course Code"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Start Time"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="QR Duration (minutes)"
            type="number"
            value={formData.qrDuration}
            onChange={(e) => setFormData({ ...formData, qrDuration: parseInt(e.target.value) })}
            margin="normal"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateLecture}>
              Create
            </Button>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          </Box>
        </Box>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>QR Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Attendees</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectures.map((lecture) => (
              <TableRow key={lecture._id}>
                <TableCell>{lecture.title}</TableCell>
                <TableCell>{lecture.course}</TableCell>
                <TableCell>{new Date(lecture.date).toLocaleDateString()}</TableCell>
                <TableCell>{lecture.qrDuration} min</TableCell>
                <TableCell>
                  <Chip label={lecture.status} color={getStatusColor(lecture.status)} size="small" />
                </TableCell>
                <TableCell>{lecture.totalAttendees || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LecturesPage;