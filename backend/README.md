# Backend Configuration

This directory contains the backend API for the QR Attendance System using Express.js and MySQL with Sequelize ORM.

## Directory Structure

```
backend/
├── config/
│   └── database.js           # Sequelize database configuration
├── models/
│   ├── User.js              # User model with password hashing
│   ├── Lecture.js           # Lecture model
│   ├── Attendance.js        # Attendance model
│   └── index.js             # Model associations and exports
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── lectureController.js # Lecture management
│   ├── attendanceController.js # Attendance tracking
│   └── qrController.js      # QR code management
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── lectureRoutes.js     # Lecture endpoints
│   ├── attendanceRoutes.js  # Attendance endpoints
│   └── qrRoutes.js          # QR code endpoints
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Request validation middleware
├── server.js                # Express app entry point
├── package.json             # Dependencies
├── .env.example             # Environment variables template
└── Dockerfile               # Docker configuration
```

## Installation

```bash
cd backend
npm install
cp .env.example .env
```

## Environment Variables

Edit `.env` with your MySQL configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qr_attendance
DB_USER=qr_user
DB_PASSWORD=qr_password
DB_DIALECT=mysql

PORT=5000
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-token` - Verify JWT token

### Users
- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:userId` - Get user by ID (requires auth)
- `PUT /api/users/:userId` - Update user (requires auth)
- `POST /api/users/:userId/change-password` - Change password (requires auth)
- `DELETE /api/users/:userId` - Delete user (requires auth)

### Lectures
- `POST /api/lectures` - Create lecture (requires auth)
- `GET /api/lectures` - Get all lectures (requires auth)
- `GET /api/lectures/:lectureId` - Get lecture by ID (requires auth)
- `PUT /api/lectures/:lectureId` - Update lecture (requires auth)
- `DELETE /api/lectures/:lectureId` - Delete lecture (requires auth)

### Attendance
- `POST /api/attendance/mark` - Mark attendance (requires auth)
- `GET /api/attendance/records` - Get attendance records (requires auth)
- `GET /api/attendance/summary/:studentId` - Get student summary (requires auth)
- `GET /api/attendance/lecture-report/:lectureId` - Get lecture report (requires auth)

### QR Codes
- `POST /api/qr/generate` - Generate QR code (requires auth)
- `POST /api/qr/verify` - Verify QR code (requires auth)
- `GET /api/qr/active/:lectureId` - Get active QR code (requires auth)
- `POST /api/qr/deactivate` - Deactivate QR code (requires auth)

## Testing with cURL

### Register
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

### Create Lecture (with token)
```bash
curl -X POST http://localhost:5000/api/lectures \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Introduction to Databases",
    "course": "CS101",
    "date": "2024-07-15T10:00:00Z",
    "startTime": "10:00",
    "endTime": "11:30",
    "qrDuration": 15,
    "room": "Room 101"
  }'
```

## Key Sequelize Methods

- `Model.findByPk(id)` - Find by primary key
- `Model.findAll(options)` - Find multiple records
- `Model.findOne(options)` - Find single record
- `Model.create(data)` - Create new record
- `model.update(data)` - Update existing record
- `model.destroy()` - Delete record
- `Model.findAndCountAll(options)` - Get count and records

## Error Handling

All endpoints return JSON responses in the format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}
}
```

## Security Features

- ✓ JWT Authentication
- ✓ Password hashing with bcrypt
- ✓ Input validation with Joi
- ✓ CORS protection
- ✓ Helmet.js security headers
- ✓ SQL injection prevention (via Sequelize ORM)

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
Ensure MySQL is running and credentials are correct in `.env`

### Port Already in Use
```bash
lsof -ti:5000 | xargs kill -9
```

### Sequelize Sync Issues
Clear database and restart:
```bash
docker-compose down
docker-compose up -d
```
