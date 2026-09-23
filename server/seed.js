const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Subject = require('./models/Subject');
const Task = require('./models/Task');
const Note = require('./models/Note');
const Exam = require('./models/Exam');
const Resource = require('./models/Resource');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-life-os';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional)
    await User.deleteMany({ email: 'demo@student.com' });

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Lucky Mourya',
      email: 'demo@student.com',
      password: hashedPassword,
      course: 'BSCS Student',
      year: '3rd Year'
    });

    const userId = user._id;

    // Seed Subjects
    const subjects = await Subject.insertMany([
      { userId, name: 'Data Structures', code: 'CS201', teacher: 'Dr. Alan Turing', description: 'Arrays, Trees, Graphs & Algorithms' },
      { userId, name: 'DBMS', code: 'CS301', teacher: 'Prof. Edgar Codd', description: 'Relational Model, SQL, Normalization' },
      { userId, name: 'Operating Systems', code: 'CS302', teacher: 'Dr. Linus Torvalds', description: 'Processes, Memory & Threads' },
      { userId, name: 'Computer Networks', code: 'CS303', teacher: 'Prof. Vint Cerf', description: 'OSI Model, TCP/IP & Socket Programming' },
      { userId, name: 'Web Development', code: 'CS304', teacher: 'Prof. Tim Berners-Lee', description: 'Fullstack React & Node.js Applications' },
      { userId, name: 'Software Engineering', code: 'CS305', teacher: 'Dr. Martin Fowler', description: 'Agile, Design Patterns & Architecture' }
    ]);

    // Seed Tasks
    await Task.insertMany([
      { userId, title: 'Complete OS Notes', description: 'Finish chapter 4 process synchronization', dueDate: new Date('2026-09-20'), priority: 'High', status: 'In Progress' },
      { userId, title: 'Prepare for Finance Quiz', description: 'Review budget calculations & balance sheet', dueDate: new Date('2026-09-22'), priority: 'Medium', status: 'Pending' },
      { userId, title: 'Design Web Project UI', description: 'Create responsive dashboards and theme components', dueDate: new Date('2026-09-25'), priority: 'High', status: 'Completed' },
      { userId, title: 'DBMS Assignment 2', description: 'Normalize database tables up to 3NF', dueDate: new Date('2026-09-28'), priority: 'High', status: 'Pending' },
      { userId, title: 'Practice React Hooks', description: 'Build custom hooks for data fetching & dark theme', dueDate: new Date('2026-10-02'), priority: 'Low', status: 'Completed' }
    ]);

    // Seed Notes
    await Note.insertMany([
      { userId, title: 'DBMS Normalization', content: '1NF: Atomic values.\n2NF: No partial dependencies.\n3NF: No transitive dependencies.\nBCNF: Strict 3NF for multi-candidate keys.', subject: 'DBMS', tags: ['sql', 'database', 'theory'] },
      { userId, title: 'React Hooks Overview', content: 'useState for local state.\nuseEffect for side effects.\nuseContext for global theme/auth.\nuseMemo & useCallback for optimization.', subject: 'Web Development', tags: ['react', 'frontend', 'javascript'] },
      { userId, title: 'Operating System Notes', content: 'Process States: New -> Ready -> Running -> Waiting -> Terminated.\nSemaphores and Mutexes handle race conditions effectively.', subject: 'Operating Systems', tags: ['os', 'threads', 'concurrency'] }
    ]);

    // Seed Exams
    await Exam.insertMany([
      { userId, examName: 'DBMS Midterm Exam', subject: 'DBMS', date: new Date('2026-10-05'), time: '09:00 AM', room: 'Hall B', description: 'Covering SQL, ER diagrams, and normalization' },
      { userId, examName: 'Operating Systems Final', subject: 'Operating Systems', date: new Date('2026-10-12'), time: '11:30 AM', room: 'Lab 4', description: 'Comprehensive exam on kernel architectures & memory management' },
      { userId, examName: 'Computer Networks Quiz', subject: 'Computer Networks', date: new Date('2026-10-18'), time: '02:00 PM', room: 'Auditorium', description: 'TCP/IP vs OSI model layers' }
    ]);

    // Seed Resources
    await Resource.insertMany([
      { userId, title: 'React Official Documentation', url: 'https://react.dev', type: 'Documentation', subject: 'Web Development', description: 'Official guide and reference for modern React hooks & components' },
      { userId, title: 'MDN Web Docs - JavaScript', url: 'https://developer.mozilla.org', type: 'Website', subject: 'Web Development', description: 'Comprehensive JavaScript reference and Web APIs' },
      { userId, title: 'Database System Concepts (PDF)', url: 'https://www.db-book.com', type: 'PDF', subject: 'DBMS', description: 'Standard textbook for relational database design' },
      { userId, title: 'Node.js Express Repository', url: 'https://github.com/expressjs/express', type: 'GitHub', subject: 'Web Development', description: 'Fast, unopinionated, minimalist web framework for Node.js' }
    ]);

    console.log('Seeding completed successfully!');
    console.log('Demo Account: demo@student.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
