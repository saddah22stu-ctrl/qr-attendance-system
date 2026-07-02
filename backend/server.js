const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { sequelize, syncDatabase } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const qrRoutes = require('./routes/qrRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.MOBILE_APP_URL || 'http://localhost:8081',
    process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000'
  ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/qr', qrRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync database models
    await syncDatabase();
    console.log('✓ Database models synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗`);
      console.log(`║  QR Attendance System - Backend API   ║`);
      console.log(`║  Server running on port: ${PORT}          ║`);
      console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}       ║`);
      console.log(`║  Database: MySQL 8.0                 ║`);
      console.log(`╚════════════════════════════════════════╝
`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;