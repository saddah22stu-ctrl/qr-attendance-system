const { Lecture, User } = require('../models');

// Create a new lecture
exports.createLecture = async (req, res) => {
  try {
    const { title, course, date, startTime, endTime, qrDuration, room, description } = req.body;
    const lecturerId = req.user?.id || req.body.lecturerId;

    const lecture = await Lecture.create({
      title,
      course,
      date,
      startTime,
      endTime,
      qrDuration: qrDuration || 15,
      room,
      description,
      lecturerId,
      status: 'scheduled'
    });

    // Include lecturer info
    await lecture.reload({
      include: [{ association: 'lecturer', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all lectures with filters
exports.getAllLectures = async (req, res) => {
  try {
    const { status, course, page = 1, limit = 10 } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (course) whereClause.course = course;

    const offset = (page - 1) * limit;

    const { count, rows } = await Lecture.findAndCountAll({
      where: whereClause,
      include: [{ association: 'lecturer', attributes: ['id', 'name', 'email'] }],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      lectures: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get lecture by ID
exports.getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByPk(lectureId, {
      include: [
        { association: 'lecturer', attributes: ['id', 'name', 'email'] },
        { association: 'attendances', attributes: ['id', 'studentId', 'status', 'checkedInAt'] }
      ]
    });

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    res.json({
      success: true,
      lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update lecture
exports.updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const updates = req.body;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    await lecture.update(updates);
    await lecture.reload({
      include: [{ association: 'lecturer', attributes: ['id', 'name', 'email'] }]
    });

    res.json({
      success: true,
      message: 'Lecture updated successfully',
      lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete lecture
exports.deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    await lecture.destroy();

    res.json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
