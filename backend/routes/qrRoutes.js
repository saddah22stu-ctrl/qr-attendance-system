const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { authMiddleware } = require('../middleware/auth');
const { validateQRGeneration } = require('../middleware/validation');

// All QR routes require authentication
router.use(authMiddleware);

// QR code operations
router.post('/generate', validateQRGeneration, qrController.generateQRCode);
router.post('/verify', qrController.verifyQRCode);
router.get('/active/:lectureId', qrController.getActiveQRCode);
router.post('/deactivate', qrController.deactivateQRCode);

module.exports = router;