const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'qr_attendance',
  process.env.DB_USER || 'qr_user',
  process.env.DB_PASSWORD || 'qr_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.SEQUELIZE_LOGGING === 'true' ? console.log : false,
    pool: {
      max: parseInt(process.env.SEQUELIZE_POOL_MAX || 20),
      min: parseInt(process.env.SEQUELIZE_POOL_MIN || 5),
      idle: parseInt(process.env.SEQUELIZE_POOL_IDLE || 10000)
    },
    timezone: '+00:00'
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connection established successfully');
  })
  .catch(err => {
    console.error('✗ Unable to connect to the database:', err);
  });

module.exports = sequelize;