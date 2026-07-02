const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// All user routes require authentication
router.use(authMiddleware);

// User CRUD operations
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUser);
router.post('/:userId/change-password', userController.changePassword);
router.delete('/:userId', userController.deleteUser);

module.exports = router;