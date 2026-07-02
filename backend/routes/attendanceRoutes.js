const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware } = require('../middleware/auth');
const { validateAttendance } = require('../middleware/validation');

// All attendance routes require authentication
router.use(authMiddleware);

// Attendance operations
router.post('/mark', validateAttendance, attendanceController.markAttendance);
router.get('/records', attendanceController.getAttendanceRecords);
router.get('/summary/:studentId', attendanceController.getStudentSummary);
router.get('/lecture-report/:lectureId', attendanceController.getLectureAttendanceReport);

module.exports = router;