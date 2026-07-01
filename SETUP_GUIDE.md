# QR Attendance System - Setup & Installation Guide

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.0 or higher)
- **npm** or **yarn**
- **Expo CLI** (for mobile app)
- **Docker & Docker Compose** (optional, for containerized setup)

## 📁 Project Structure

```
qr-attendance-system/
├── backend/                 # Express.js API Server
│   ├── models/             # MongoDB Schemas
│   ├── controllers/        # Business Logic
│   ├── routes/             # API Endpoints
│   ├── server.js           # Main Server File
│   └── .env.example        # Environment Variables
├── mobile-app/             # React Native Mobile Application
│   ├── screens/            # Mobile Screens
│   ├── App.js              # Main App Component
│   └── app.json            # Expo Configuration
├── docker-compose.yml      # Docker Setup
└── README.md
```

## 🚀 Quick Start

### Option 1: Local Setup (Recommended for Development)

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your MongoDB connection string
# Default: mongodb://localhost:27017/qr-attendance

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
# MongoDB will be available at: mongodb://localhost:27017
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```
# Database
MONGODB_URI=mongodb://localhost:27017/qr-attendance
MONGODB_USER=admin
MONGODB_PASSWORD=password

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# QR Code
QR_CODE_EXPIRY=15  # minutes
QR_CODE_SECRET=your_qr_code_secret

# CORS
MOBILE_APP_URL=http://localhost:8081
ADMIN_DASHBOARD_URL=http://localhost:3000
```

## 📱 Mobile App API Configuration

In `mobile-app/screens/`, update API_URL to your backend:

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
- MongoDB Injection Prevention

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

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify credentials if using authentication

### Port Already in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=5001
```

### QR Scanner Not Working
- Grant camera permissions in mobile app
- Check device has camera
- Ensure good lighting for scanning

## 📝 License

MIT License - Free to use and modify

## 🤝 Support

For issues and feature requests, please create an issue on GitHub.

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Expo Documentation](https://docs.expo.dev/)

---

**Happy Coding! 🚀**