const { Lecture } = require('../models');
const crypto = require('crypto');
const QRCode = require('qrcode');

// Generate QR code
exports.generateQRCode = async (req, res) => {
  try {
    const { lectureId, duration = 15 } = req.body;

    // Check if lecture exists
    const lecture = await Lecture.findByPk(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    // Generate unique QR code token
    const qrToken = crypto.randomBytes(16).toString('hex');
    const expiryTime = new Date(Date.now() + duration * 60 * 1000);

    // Update lecture with QR code
    await lecture.update({
      qrCode: qrToken,
      qrCodeExpiry: expiryTime,
      status: 'ongoing'
    });

    // Generate QR code image data
    const qrCodeData = await QRCode.toDataURL(qrToken);

    res.json({
      success: true,
      message: 'QR code generated successfully',
      qrCode: {
        token: qrToken,
        expiresIn: duration,
        expiryTime,
        qrCodeImage: qrCodeData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify QR code
exports.verifyQRCode = async (req, res) => {
  try {
    const { lectureId, qrCode } = req.body;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    if (!lecture.qrCode || lecture.qrCode !== qrCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    const now = new Date();
    if (now > lecture.qrCodeExpiry) {
      return res.status(400).json({
        success: false,
        message: 'QR code has expired'
      });
    }

    res.json({
      success: true,
      message: 'QR code is valid',
      lecture: {
        id: lecture.id,
        title: lecture.title,
        course: lecture.course
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get active QR code for a lecture
exports.getActiveQRCode = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    const now = new Date();
    if (!lecture.qrCode || now > lecture.qrCodeExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No active QR code for this lecture'
      });
    }

    // Generate QR code image
    const qrCodeData = await QRCode.toDataURL(lecture.qrCode);

    res.json({
      success: true,
      qrCode: {
        token: lecture.qrCode,
        expiryTime: lecture.qrCodeExpiry,
        qrCodeImage: qrCodeData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Deactivate QR code
exports.deactivateQRCode = async (req, res) => {
  try {
    const { lectureId } = req.body;

    const lecture = await Lecture.findByPk(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }

    await lecture.update({
      qrCode: null,
      qrCodeExpiry: null,
      status: 'completed'
    });

    res.json({
      success: true,
      message: 'QR code deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
