# QR Attendance System - Complete Implementation Guide

## 🎯 System Overview

The QR Attendance System is a modern, full-stack application that streamlines attendance management through QR code technology. It consists of three main components:

1. **Backend API** - Node.js/Express server with MongoDB database
2. **Mobile App** - React Native application for students
3. **Admin Dashboard** - React web application for lecturers and admins

---

## 📦 What's Included

### Backend Features
✅ User authentication and authorization  
✅ Lecture management with customizable QR duration  
✅ Real-time QR code generation and verification  
✅ Attendance marking and tracking  
✅ Comprehensive reporting system  
✅ Socket.io for real-time updates  
✅ Security with JWT and password hashing  

### Mobile App Features
✅ User registration and login  
✅ QR code scanner with instant attendance marking  
✅ Real-time attendance history  
✅ Personal attendance statistics  
✅ Location tracking capability  
✅ User profile management  

### Admin Dashboard Features
✅ User management interface  
✅ Lecture creation and management  
✅ Real-time attendance monitoring  
✅ Attendance reports and analytics  
✅ Dashboard with system statistics  

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v14+
- MongoDB v4.0+
- npm or yarn
- Expo CLI (for mobile)
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the server
npm start
```

**Default Backend URL:** `http://localhost:5000`

### 2. Mobile App Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start the app
npm start

# Choose platform:
# Press 'a' for Android
# Press 'i' for iOS
# Press 'w' for Web preview
```

### 3. Admin Dashboard Setup

```bash
# Navigate to admin dashboard directory
cd admin-dashboard

# Install dependencies
npm install

# Start the dashboard
npm start
```

**Default Dashboard URL:** `http://localhost:3000`

---

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env` with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/qr-attendance
MONGODB_USER=admin
MONGODB_PASSWORD=password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# QR Code Configuration
QR_CODE_EXPIRY=15  # Minutes before QR code expires
QR_CODE_SECRET=your_qr_code_secret

# CORS Configuration
MOBILE_APP_URL=http://localhost:8081
ADMIN_DASHBOARD_URL=http://localhost:3000
```

---

## 📱 User Roles

### Student
- Register with student ID
- Scan QR codes to mark attendance
- View personal attendance history
- Track attendance statistics
- Access profile settings

### Lecturer
- Create lectures
- Set custom QR code duration (5-60 minutes)
- Generate and manage QR codes
- View real-time attendance
- Generate lecture reports

### Admin
- Manage all users
- Manage all lectures
- View system-wide reports
- Access analytics dashboard

---

## 🎓 How to Use

### For Students

1. **Register**
   - Open mobile app
   - Click "Register"
   - Enter name, email, student ID, and password
   - Tap "Create Account"

2. **Login**
   - Enter email and password
   - Tap "Sign In"

3. **Mark Attendance**
   - Go to "Scanner" tab
   - Point camera at QR code
   - Wait for confirmation
   - Check attendance history

### For Lecturers

1. **Create a Lecture**
   - Login to admin dashboard
   - Click "Create Lecture" button
   - Fill lecture details
   - Set QR duration (default: 15 minutes)
   - Submit

2. **Generate QR Code**
   - Go to Lectures page
   - Click on a lecture
   - Click "Generate QR Code"
   - QR code becomes active for set duration

3. **View Attendance**
   - Go to Attendance page
   - Real-time attendance updates
   - Students appear as they scan QR code

### For Admins

1. **Access Dashboard**
   - Open admin dashboard at `http://localhost:3000`
   - Login with admin credentials
   - View system statistics

2. **Manage Users**
   - Click "Users" in sidebar
   - View all registered users
   - Filter by role (student/lecturer/admin)

3. **View Reports**
   - Click "Reports" in sidebar
   - Generate attendance reports
   - Export data if needed

---

## 🔌 API Integration

### Authentication Endpoints

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "studentId": "STU001",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Lecture Endpoints

```bash
# Create lecture
curl -X POST http://localhost:5000/api/lectures \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Databases",
    "course": "CS101",
    "date": "2024-07-15T10:00:00Z",
    "startTime": "10:00",
    "endTime": "11:30",
    "qrDuration": 15,
    "room": "Room 101"
  }'

# Get all lectures
curl -X GET http://localhost:5000/api/lectures \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### QR Code Endpoints

```bash
# Generate QR code
curl -X POST http://localhost:5000/api/qr/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lectureId": "LECTURE_ID",
    "duration": 15
  }'

# Mark attendance
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_ID",
    "lectureId": "LECTURE_ID",
    "qrToken": "QR_TOKEN"
  }'
```

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

**MongoDB** will be available at: `mongodb://admin:password@localhost:27017`  
**Backend** will be available at: `http://localhost:5000`

---

## 📊 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/lecturer/admin),
  studentId: String (unique, for students),
  department: String,
  phone: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Lecture Schema
```javascript
{
  title: String,
  course: String,
  lecturer: ObjectId (ref: User),
  date: Date,
  startTime: String,
  endTime: String,
  qrDuration: Number,
  qrCode: String,
  qrCodeExpiry: Date,
  students: [ObjectId],
  totalAttendees: Number,
  status: String (scheduled/ongoing/completed),
  createdAt: Date
}
```

### Attendance Schema
```javascript
{
  student: ObjectId (ref: User),
  lecture: ObjectId (ref: Lecture),
  qrCode: String,
  checkedInAt: Date,
  status: String (present/late/absent),
  deviceInfo: {
    location: { latitude, longitude }
  },
  createdAt: Date
}
```

---

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based authentication  
✅ **Password Hashing** - bcrypt for password encryption  
✅ **CORS Protection** - Whitelist allowed origins  
✅ **Helmet.js** - Security headers  
✅ **Input Validation** - Joi schema validation  
✅ **Rate Limiting** - Prevent brute force attacks (can be added)  
✅ **HTTPS Ready** - SSL/TLS support  

---

## 📈 Performance Optimization

✅ Database indexing on frequently queried fields  
✅ Pagination support for large datasets  
✅ Caching strategy with Redis (optional)  
✅ Connection pooling for database  
✅ Gzip compression for API responses  

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Solution: Ensure MongoDB is running
$ mongod
```

### Port Already in Use
```
Solution: Change PORT in .env or kill existing process
$ lsof -ti:5000 | xargs kill -9
```

### Camera Permission Denied
```
Solution: Grant camera permissions in mobile app settings
```

### QR Code Not Scanning
```
Solution: 
1. Ensure good lighting
2. Check QR code is not expired
3. Verify camera focus
```

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Native Docs](https://reactnative.dev/)
- [Socket.io Docs](https://socket.io/docs/)
- [JWT Guide](https://jwt.io/)

---

## 📞 Support & Contribution

For issues, bugs, or feature requests, please create a GitHub issue.  
Contributions are welcome! Please follow the code style guidelines.

---

**Version:** 1.0.0  
**Last Updated:** July 2024  
**License:** MIT  

**Happy Coding! 🚀**