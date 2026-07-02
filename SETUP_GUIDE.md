# QR Attendance System - Setup & Installation Guide

## Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher) - **UPDATED FROM MONGODB**
- **npm** or **yarn**
- **Expo CLI** (for mobile app)
- **Docker & Docker Compose** (optional, for containerized setup)

## 📁 Project Structure

```
qr-attendance-system/
├── backend/                 # Express.js API Server
│   ├── config/              # Database configuration
│   ├── models/              # Sequelize Models (MySQL)
│   ├── controllers/         # Business Logic
│   ├── routes/              # API Endpoints
│   ├── Dockerfile           # Docker configuration
│   ├── server.js            # Main Server File
│   └── .env.example         # Environment Variables (MySQL)
├── mobile-app/              # React Native Mobile Application
│   ├── screens/             # Mobile Screens
│   ├── App.js               # Main App Component
│   └── app.json             # Expo Configuration
├── admin-dashboard/         # React Admin Dashboard
├── docker-compose.yml       # Docker Setup (MySQL instead of MongoDB)
└── README.md
```

## 🚀 Quick Start

### Option 1: Local Setup (Recommended for Development)

#### Prerequisites for Local Setup

1. **Install MySQL 8.0**
   - [Windows](https://dev.mysql.com/downloads/mysql/)
   - [macOS](https://dev.mysql.com/downloads/mysql/)
   - [Linux](https://dev.mysql.com/doc/mysql-apt-repository-quick-guide/en/)

2. **Create Database and User**

   ```bash
   # Connect to MySQL
   mysql -u root -p
   ```

   ```sql
   -- Create database
   CREATE DATABASE qr_attendance;

   -- Create user
   CREATE USER 'qr_user'@'localhost' IDENTIFIED BY 'qr_password';

   -- Grant permissions
   GRANT ALL PRIVILEGES ON qr_attendance.* TO 'qr_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

#### Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your MySQL connection string
# Default: DB_HOST=localhost, DB_USER=qr_user, DB_PASSWORD=qr_password

# Install dependencies
npm install

# Start the server
npm start
# Server will run on http://localhost:5000
```

#### Mobile App Setup

```bash
cd mobile-app

npm install

npm start

# Choose platform:
# Press 'a' for Android
# Press 'i' for iOS
# Press 'w' for Web
```

### Option 2: Docker Setup (Recommended for Production)

```bash
# Make sure Docker and Docker Compose are installed
docker-compose up -d

# Backend will be available at: http://localhost:5000
# MySQL will be available at: localhost:3306

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 🔧 Configuration

### Backend Environment Variables (.env)

**UPDATED: Now uses MySQL configuration**

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qr_attendance
DB_USER=qr_user
DB_PASSWORD=qr_password
DB_DIALECT=mysql

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# QR Code Configuration
QR_CODE_EXPIRY=15  # minutes
QR_CODE_SECRET=your_qr_code_secret

# CORS Configuration
MOBILE_APP_URL=http://localhost:8081
ADMIN_DASHBOARD_URL=http://localhost:3000

# Sequelize Configuration (Connection Pooling)
SEQUELIZE_LOGGING=false
SEQUELIZE_POOL_MIN=5
SEQUELIZE_POOL_MAX=20
SEQUELIZE_POOL_IDLE=10000
```

### Docker Compose Configuration

**UPDATED: Uses MySQL 8.0 instead of MongoDB**

The `docker-compose.yml` now includes:
- **MySQL 8.0** service with persistent storage
- Health checks to ensure MySQL is ready before backend starts
- Environment variables for MySQL configuration
- Volume mapping for database persistence

## 📱 Mobile App API Configuration

In `mobile-app/`, update API_URL to your backend:

```javascript
const API_URL = 'http://your-backend-url:5000/api';
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-token` - Verify JWT token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user

### Lectures
- `POST /api/lectures` - Create lecture
- `GET /api/lectures` - Get all lectures
- `GET /api/lectures/:lectureId` - Get lecture details
- `PUT /api/lectures/:lectureId` - Update lecture
- `POST /api/lectures/:lectureId/add-students` - Add students to lecture

### QR Codes
- `POST /api/qr/generate` - Generate QR code
- `POST /api/qr/verify` - Verify QR code
- `GET /api/qr/active/:lectureId` - Get active QR code
- `POST /api/qr/deactivate` - Deactivate QR code

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/records` - Get attendance records
- `GET /api/attendance/summary/:studentId` - Get student summary

### Reports
- `GET /api/reports/lecture/:lectureId` - Get lecture attendance report
- `GET /api/reports/student/:studentId/stats` - Get student statistics

## 🎯 Features

### For Students
- ✅ User Registration & Login
- ✅ QR Code Scanner
- ✅ Real-time Attendance Marking
- ✅ Attendance History
- ✅ Attendance Statistics
- ✅ Profile Management

### For Lecturers
- ✅ Create Lectures
- ✅ Generate Time-Limited QR Codes (5-60 minutes)
- ✅ Add Students to Lecture
- ✅ View Real-time Attendance
- ✅ Generate Reports

### For Admins
- ✅ User Management
- ✅ Lecture Management
- ✅ System-wide Reports
- ✅ Analytics

## 🤖 AI Features (Future Enhancements)

- Automatic attendance anomaly detection
- Predictive analytics for low attendance
- Auto-email alerts
- Smart report generation
- Pattern recognition for fraud detection

## 🔐 Security Features

- JWT Authentication
- Password Hashing with bcrypt
- CORS Protection
- Helmet.js Security Headers
- Input Validation
- SQL Injection Prevention (via Sequelize ORM)

## 📊 Real-time Features

- **Socket.io Integration** for live updates
- Live attendance tracking during lectures
- Real-time QR code expiry notifications
- Instant attendance status updates

## 🧪 Testing the System

### Create Test Data

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "studentId": "STU001",
    "role": "student"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🐛 Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running: `mysql -u root -p`
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Verify database exists: `mysql -u qr_user -p -e "SHOW DATABASES;" qr_attendance`

### Port Already in Use
```bash
# Change PORT in .env or kill process
lsof -ti:3306 | xargs kill -9  # MySQL
lsof -ti:5000 | xargs kill -9  # Backend
```

### QR Scanner Not Working
- Grant camera permissions in mobile app
- Check device has camera
- Ensure good lighting for scanning

### Database Sync Issues
- Clear MySQL database and restart: `docker-compose down && docker-compose up -d`
- Or manually reset: `DROP DATABASE qr_attendance; CREATE DATABASE qr_attendance;`

## 📝 Database Migration

For detailed information about the MongoDB to MySQL migration:
- See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## 📝 License

MIT License - Free to use and modify

## 🤝 Support

For issues and feature requests, please create an issue on GitHub.

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Sequelize Documentation](https://sequelize.org/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Expo Documentation](https://docs.expo.dev/)

---

**Happy Coding! 🚀**