const { Attendance, Lecture, User } = require('../models');
const { Op } = require('sequelize');

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, lectureId, qrCode, latitude, longitude } = req.body;

    // Check if lecture exists
    const lecture = await Lecture.findByPk(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Check if QR code is still valid
    const now = new Date();
    if (!lecture.qrCodeExpiry || now > lecture.qrCodeExpiry) {
      return res.status(400).json({
        success: false,
        message: 'QR code has expired'
      });
    }

    // Check if student already marked attendance
    const existingAttendance = await Attendance.findOne({
      where: { studentId, lectureId }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this lecture'
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      studentId,
      lectureId,
      qrCode,
      status: 'present',
      latitude,
      longitude,
      checkedInAt: now,
      deviceInfo: req.body.deviceInfo || {}
    });

    // Update lecture total attendees
    await lecture.increment('totalAttendees');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get attendance records
exports.getAttendanceRecords = async (req, res) => {
  try {
    const { lectureId, studentId, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (lectureId) whereClause.lectureId = lectureId;
    if (studentId) whereClause.studentId = studentId;

    const offset = (page - 1) * limit;

    const { count, rows } = await Attendance.findAndCountAll({
      where: whereClause,
      include: [
        { association: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { association: 'lecture', attributes: ['id', 'title', 'course', 'date'] }
      ],
      order: [['checkedInAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      records: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get student attendance summary
exports.getStudentSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const whereClause = { studentId };

    if (startDate || endDate) {
      whereClause.checkedInAt = {};
      if (startDate) whereClause.checkedInAt[Op.gte] = new Date(startDate);
      if (endDate) whereClause.checkedInAt[Op.lte] = new Date(endDate);
    }

    const records = await Attendance.findAll({
      where: whereClause,
      include: [{ association: 'lecture', attributes: ['id', 'title', 'course', 'date'] }]
    });

    const summary = {
      totalLectures: records.length,
      present: records.filter(r => r.status === 'present').length,
      late: records.filter(r => r.status === 'late').length,
      absent: records.filter(r => r.status === 'absent').length,
      attendancePercentage: records.length > 0 
        ? ((records.filter(r => r.status === 'present').length / records.length) * 100).toFixed(2)
        : 0
    };

    res.json({
      success: true,
      summary,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get lecture attendance report
exports.getLectureAttendanceReport = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByPk(lectureId, {
      include: [{ association: 'attendances' }]
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    const report = {
      lecture: {
        id: lecture.id,
        title: lecture.title,
        course: lecture.course,
        date: lecture.date
      },
      totalAttendees: lecture.totalAttendees,
      attendanceDetails: lecture.attendances
    };

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
