const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Lecture = require('../models/Lecture');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-attendance', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lecture.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      },
      {
        name: 'Prof. John Smith',
        email: 'john.smith@example.com',
        password: 'lecturer123',
        role: 'lecturer',
        department: 'Computer Science',
        isActive: true
      },
      {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU001',
        department: 'Computer Science',
        isActive: true
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU002',
        department: 'Computer Science',
        isActive: true
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU003',
        department: 'Computer Science',
        isActive: true
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create sample lectures
    const lecturer = users.find(u => u.role === 'lecturer');
    const students = users.filter(u => u.role === 'student');

    const lectures = await Lecture.create([
      {
        title: 'Introduction to Databases',
        course: 'CS101',
        lecturer: lecturer._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        startTime: '10:00',
        endTime: '11:30',
        qrDuration: 15,
        room: 'Room 101',
        description: 'Introduction to database concepts and SQL',
        students: students.map(s => s._id),
        status: 'scheduled'
      },
      {
        title: 'Web Development Basics',
        course: 'CS102',
        lecturer: lecturer._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        startTime: '14:00',
        endTime: '15:30',
        qrDuration: 20,
        room: 'Room 102',
        description: 'Learn HTML, CSS, and JavaScript basics',
        students: students.map(s => s._id),
        status: 'scheduled'
      },
      {
        title: 'Data Structures',
        course: 'CS201',
        lecturer: lecturer._id,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        startTime: '09:00',
        endTime: '10:30',
        qrDuration: 15,
        room: 'Room 201',
        description: 'Advanced data structures and algorithms',
        students: students.map(s => s._id),
        status: 'completed'
      }
    ]);

    console.log(`Created ${lectures.length} lectures`);

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Lecturer: john.smith@example.com / lecturer123');
    console.log('Student: jane.doe@example.com / student123');
    console.log('\nOther Students:');
    console.log('john.doe@example.com / student123');
    console.log('alice.johnson@example.com / student123');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
