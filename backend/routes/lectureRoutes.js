const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');

router.post('/', lectureController.createLecture);
router.get('/', lectureController.getAllLectures);
router.get('/:lectureId', lectureController.getLectureById);
router.put('/:lectureId', lectureController.updateLecture);
router.post('/:lectureId/add-students', lectureController.addStudentsToLecture);
router.delete('/:lectureId', lectureController.deleteLecture);

module.exports = router;