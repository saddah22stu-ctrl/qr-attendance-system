const Lecture = require('../models/Lecture');
const User = require('../models/User');

exports.createLecture = async (req, res) => {
  try {
    const { title, course, date, startTime, endTime, qrDuration, room, description, students } = req.body;
    const lecturerId = req.user?.id || req.body.lecturerId;

    const lecture = new Lecture({
      title,
      course,
      date,
      startTime,
      endTime,
      qrDuration: qrDuration || 15,
      room,
      description,
      lecturer: lecturerId,
      students: students || []
    });

    await lecture.save();
    await lecture.populate('lecturer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      lecture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLectures = async (req, res) => {
  try {
    const { status, course } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (course) filter.course = course;

    const lectures = await Lecture.find(filter)
      .populate('lecturer', 'name email')
      .populate('students', 'name studentId email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: lectures.length,
      lectures
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId)
      .populate('lecturer', 'name email')
      .populate('students', 'name studentId email');

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    res.json({
      success: true,
      lecture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const updates = req.body;

    const lecture = await Lecture.findByIdAndUpdate(
      lectureId,
      updates,
      { new: true, runValidators: true }
    );

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    res.json({
      success: true,
      message: 'Lecture updated successfully',
      lecture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addStudentsToLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { studentIds } = req.body;

    const lecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { $addToSet: { students: { $each: studentIds } } },
      { new: true }
    ).populate('students', 'name studentId email');

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    res.json({
      success: true,
      message: 'Students added to lecture',
      lecture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    res.json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};