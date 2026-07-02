const sequelize = require('../config/database');
const User = require('./User');
const Lecture = require('./Lecture');
const Attendance = require('./Attendance');

// Define associations
Lecture.belongsTo(User, { foreignKey: 'lecturerId', as: 'lecturer' });
User.hasMany(Lecture, { foreignKey: 'lecturerId', as: 'lectures' });

Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
User.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });

Attendance.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });
Lecture.hasMany(Attendance, { foreignKey: 'lectureId', as: 'attendances' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('✓ Database models synchronized');
  } catch (error) {
    console.error('✗ Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Lecture,
  Attendance,
  syncDatabase
};