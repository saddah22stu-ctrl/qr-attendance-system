const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Lecture = require('../models/Lecture');

router.get('/lecture/:lectureId', async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId).populate('students', 'name studentId email');
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    const attendance = await Attendance.find({ lecture: lectureId })
      .populate('student', 'name studentId email')
      .sort({ checkedInAt: -1 });

    const report = {
      lectureInfo: {
        title: lecture.title,
        course: lecture.course,
        date: lecture.date,
        totalStudents: lecture.students.length,
        presentStudents: attendance.length,
        absentStudents: lecture.students.length - attendance.length
      },
      attendanceDetails: attendance,
      attendancePercentage: ((attendance.length / lecture.students.length) * 100).toFixed(2)
    };

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/student/:studentId/stats', async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ student: studentId })
      .populate('lecture', 'title course date');

    const stats = {
      totalClasses: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      late: attendance.filter(a => a.status === 'late').length,
      absent: attendance.filter(a => a.status === 'absent').length
    };

    res.json({ success: true, stats, records: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;