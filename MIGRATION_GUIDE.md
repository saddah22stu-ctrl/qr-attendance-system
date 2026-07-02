# MongoDB to MySQL Migration Guide

## Overview

This project has been migrated from MongoDB to MySQL 8.0 with Sequelize ORM. This guide provides information about the changes and how to work with the new database.

## Key Changes

### 1. Database System
- **Old**: MongoDB (NoSQL)
- **New**: MySQL 8.0 (Relational)

### 2. ORM Framework
- **New**: Sequelize.js - A promise-based Node.js ORM for MySQL, MariaDB, SQLite, and PostgreSQL

### 3. Package Dependencies

#### Removed:
- `mongoose` - MongoDB ODM
- `mongodb` - MongoDB driver

#### Added:
- `sequelize` - ORM framework
- `mysql2` - MySQL client for Node.js
- `sequelize-cli` - Command-line interface for Sequelize

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── models/
│   ├── User.js              # User model with password hashing
│   ├── Lecture.js           # Lecture model
│   ├── Attendance.js        # Attendance model
│   └── index.js             # Model associations and sync
├── controllers/             # Business logic (unchanged structure)
├── routes/                  # API endpoints (unchanged structure)
├── .env.example             # Updated with MySQL variables
├── package.json             # Updated dependencies
└── server.js                # Main server file
```

## Database Configuration

### Environment Variables (.env)

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qr_attendance
DB_USER=qr_user
DB_PASSWORD=qr_password
DB_DIALECT=mysql

# Sequelize Pool Configuration
SEQUELIZE_POOL_MIN=5
SEQUELIZE_POOL_MAX=20
SEQUELIZE_POOL_IDLE=10000
```

## Setup Instructions

### Option 1: Docker Setup (Recommended)

```bash
# Start MySQL and Backend containers
docker-compose up -d

# Verify services are running
docker-compose ps
```

MySQL will be available at: `localhost:3306`  
Backend will be available at: `localhost:5000`

### Option 2: Local Setup

#### Prerequisites
- MySQL 8.0 installed and running
- Node.js v14+

#### Installation Steps

1. **Create MySQL Database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE qr_attendance;
   CREATE USER 'qr_user'@'localhost' IDENTIFIED BY 'qr_password';
   GRANT ALL PRIVILEGES ON qr_attendance.* TO 'qr_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Copy and update .env
   cp .env.example .env
   
   # Install dependencies
   npm install
   
   # Start the server
   npm start
   ```

## Database Models

### User Model
```javascript
{
  id: UUID (Primary Key),
  name: String,
  email: String (Unique),
  password: String (Hashed with bcrypt),
  role: Enum ('student', 'lecturer', 'admin'),
  studentId: String (Unique),
  department: String,
  phone: String,
  isActive: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Lecture Model
```javascript
{
  id: UUID (Primary Key),
  title: String,
  course: String,
  lecturerId: UUID (Foreign Key -> User),
  date: Date,
  startTime: Time,
  endTime: Time,
  qrDuration: Integer (minutes),
  qrCode: String,
  qrCodeExpiry: DateTime,
  room: String,
  status: Enum ('scheduled', 'ongoing', 'completed'),
  totalAttendees: Integer,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Attendance Model
```javascript
{
  id: UUID (Primary Key),
  studentId: UUID (Foreign Key -> User),
  lectureId: UUID (Foreign Key -> Lecture),
  qrCode: String,
  status: Enum ('present', 'late', 'absent'),
  checkedInAt: DateTime,
  latitude: Decimal,
  longitude: Decimal,
  deviceInfo: JSON,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

## Model Relationships

```
User (1) -----> (Many) Lecture
  ↓
  └─→ (1) -----> (Many) Attendance

Lecture (1) -----> (Many) Attendance
```

## API Integration Changes

The API endpoints remain the same. However, controllers need to be updated to work with Sequelize instead of Mongoose.

### Before (Mongoose)
```javascript
const user = await User.findById(userId);
```

### After (Sequelize)
```javascript
const user = await User.findByPk(userId);
```

## Data Migration from MongoDB

If you have existing MongoDB data to migrate:

1. Export MongoDB collections as JSON:
   ```bash
   mongoexport --db qr_attendance --collection users --out users.json
   ```

2. Create a migration script to import into MySQL

3. Run the migration script:
   ```bash
   node scripts/migrate-data.js
   ```

## Common Sequelize Methods

### Create
```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password',
  role: 'student'
});
```

### Read
```javascript
// Find by primary key
const user = await User.findByPk(id);

// Find one by condition
const user = await User.findOne({ where: { email: 'john@example.com' } });

// Find all
const users = await User.findAll();

// Find all with pagination
const users = await User.findAll({ limit: 10, offset: 0 });
```

### Update
```javascript
const user = await User.findByPk(id);
await user.update({ name: 'Jane Doe' });

// Or directly
await User.update({ name: 'Jane Doe' }, { where: { id } });
```

### Delete
```javascript
const user = await User.findByPk(id);
await user.destroy();

// Or directly
await User.destroy({ where: { id } });
```

## Querying with Relationships

```javascript
// Get user with all lectures
const user = await User.findByPk(userId, {
  include: [{ association: 'lectures' }]
});

// Get lecture with lecturer info
const lecture = await Lecture.findByPk(lectureId, {
  include: [{ association: 'lecturer' }]
});

// Get attendance with student and lecture
const attendance = await Attendance.findByPk(attendanceId, {
  include: [
    { association: 'student' },
    { association: 'lecture' }
  ]
});
```

## Password Management

Passwords are automatically hashed using bcrypt before storing:

```javascript
// Comparing passwords
const isMatch = await user.comparePassword(plainTextPassword);
```

## Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f mysql

# Access MySQL
docker exec -it <mysql-container-id> mysql -u qr_user -p

# Rebuild containers
docker-compose up -d --build
```

## Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure MySQL is running and credentials are correct in .env

### Port Already in Use
```bash
# Change port in docker-compose.yml or .env
# Or kill existing process
lsof -ti:3306 | xargs kill -9
```

### Sequelize Sync Issues
```javascript
// Force sync (drops existing tables)
await sequelize.sync({ force: true });
```

## Performance Tips

1. **Use Connection Pooling**: Already configured with min: 5, max: 20
2. **Add Database Indexes**: Important fields like email, studentId, lectureId
3. **Lazy Load Relationships**: Use include only when needed
4. **Use Pagination**: For large datasets

## Testing

```bash
# Register a new user
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

## Next Steps

1. Update all controllers to use Sequelize methods
2. Update all routes to work with new models
3. Test all API endpoints
4. Update unit tests for database operations
5. Perform load testing to verify performance

## Resources

- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [Express.js Documentation](https://expressjs.com/)

## Support

For issues or questions about the migration, please create a GitHub issue.
