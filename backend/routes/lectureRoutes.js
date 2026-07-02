const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { authMiddleware } = require('../middleware/auth');
const { validateLecture } = require('../middleware/validation');

// All lecture routes require authentication
router.use(authMiddleware);

// Lecture CRUD operations
router.post('/', validateLecture, lectureController.createLecture);
router.get('/', lectureController.getAllLectures);
router.get('/:lectureId', lectureController.getLectureById);
router.put('/:lectureId', lectureController.updateLecture);
router.delete('/:lectureId', lectureController.deleteLecture);

module.exports = router;