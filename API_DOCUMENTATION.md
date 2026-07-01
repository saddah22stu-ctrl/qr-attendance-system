# QR Attendance System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "studentId": "STU001",
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

## Lecture Endpoints

### Create Lecture
**POST** `/lectures`

**Request Body:**
```json
{
  "title": "Introduction to Databases",
  "course": "CS101",
  "date": "2024-07-15T10:00:00Z",
  "startTime": "10:00",
  "endTime": "11:30",
  "qrDuration": 15,
  "room": "Room 101",
  "description": "Lecture on database fundamentals",
  "lecturerId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lecture created successfully",
  "lecture": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Introduction to Databases",
    "course": "CS101",
    "status": "scheduled",
    "totalAttendees": 0
  }
}
```

---

### Get All Lectures
**GET** `/lectures?status=ongoing&course=CS101`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "lectures": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Introduction to Databases",
      "course": "CS101",
      "status": "ongoing",
      "totalAttendees": 25
    }
  ]
}
```

---

## QR Code Endpoints

### Generate QR Code
**POST** `/qr/generate`

**Request Body:**
```json
{
  "lectureId": "507f1f77bcf86cd799439012",
  "duration": 15
}
```

**Response:**
```json
{
  "success": true,
  "qrToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "qrCodeImage": "data:image/png;base64,...",
  "expiryTime": "2024-07-15T10:15:00Z",
  "duration": 15
}
```

---

### Verify QR Code
**POST** `/qr/verify`

**Request Body:**
```json
{
  "qrToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "lectureId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "valid": true,
  "lecture": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Introduction to Databases",
    "course": "CS101"
  }
}
```

---

## Attendance Endpoints

### Mark Attendance
**POST** `/attendance/mark`

**Request Body:**
```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "lectureId": "507f1f77bcf86cd799439012",
  "qrToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "location": {
    "latitude": 5.6521,
    "longitude": -0.1938
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "attendance": {
    "id": "507f1f77bcf86cd799439013",
    "status": "present",
    "timestamp": "2024-07-15T10:05:00Z"
  }
}
```

---

### Get Attendance Records
**GET** `/attendance/records?lectureId=507f1f77bcf86cd799439012&studentId=507f1f77bcf86cd799439011`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "student": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "studentId": "STU001"
      },
      "lecture": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Introduction to Databases",
        "course": "CS101"
      },
      "status": "present",
      "checkedInAt": "2024-07-15T10:05:00Z"
    }
  ]
}
```

---

## Report Endpoints

### Get Lecture Report
**GET** `/reports/lecture/507f1f77bcf86cd799439012`

**Response:**
```json
{
  "success": true,
  "report": {
    "lectureInfo": {
      "title": "Introduction to Databases",
      "course": "CS101",
      "date": "2024-07-15T10:00:00Z",
      "totalStudents": 30,
      "presentStudents": 28,
      "absentStudents": 2
    },
    "attendancePercentage": "93.33",
    "attendanceDetails": [...]
  }
}
```

---

### Get Student Statistics
**GET** `/reports/student/507f1f77bcf86cd799439011/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalClasses": 15,
    "present": 14,
    "late": 1,
    "absent": 0
  },
  "records": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error",
  "error": "Error details (only in development)"
}
```

---

## Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

**Last Updated:** July 2024