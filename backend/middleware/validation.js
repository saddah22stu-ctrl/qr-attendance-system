const Joi = require('joi');

// Validate registration
const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'lecturer', 'admin').default('student'),
    studentId: Joi.string(),
    department: Joi.string(),
    phone: Joi.string()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

// Validate login
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

// Validate lecture creation
const validateLecture = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    course: Joi.string().min(2).max(100).required(),
    date: Joi.date().required(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    qrDuration: Joi.number().min(5).max(60).default(15),
    room: Joi.string(),
    description: Joi.string().max(500)
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

// Validate attendance marking
const validateAttendance = (req, res, next) => {
  const schema = Joi.object({
    studentId: Joi.string().uuid().required(),
    lectureId: Joi.string().uuid().required(),
    qrCode: Joi.string().required(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    deviceInfo: Joi.object()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

// Validate QR code generation
const validateQRGeneration = (req, res, next) => {
  const schema = Joi.object({
    lectureId: Joi.string().uuid().required(),
    duration: Joi.number().min(5).max(60).default(15)
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateLecture,
  validateAttendance,
  validateQRGeneration
};