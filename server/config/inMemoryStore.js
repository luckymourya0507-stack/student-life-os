const bcrypt = require('bcryptjs');

// Default Demo Data
const demoUser = {
  _id: 'user_demo_123',
  id: 'user_demo_123',
  name: 'Lucky Mourya',
  email: 'demo@student.com',
  password: '', // hashed below
  course: 'BSCS Student',
  year: '3rd Year',
  profileImage: ''
};

// Initialize the demo password before handling authentication requests.
const ready = bcrypt.hash('password123', 10).then((hashed) => {
  demoUser.password = hashed;
});

const inMemoryStore = {
  ready,
  users: [demoUser],
  subjects: [
    { _id: 'sub_1', userId: 'user_demo_123', name: 'Data Structures', code: 'CS201', teacher: 'Dr. Alan Turing', description: 'Arrays, Trees, Graphs & Algorithms' },
    { _id: 'sub_2', userId: 'user_demo_123', name: 'DBMS', code: 'CS301', teacher: 'Prof. Edgar Codd', description: 'Relational Model, SQL, Normalization' },
    { _id: 'sub_3', userId: 'user_demo_123', name: 'Operating Systems', code: 'CS302', teacher: 'Dr. Linus Torvalds', description: 'Processes, Memory & Threads' },
    { _id: 'sub_4', userId: 'user_demo_123', name: 'Computer Networks', code: 'CS303', teacher: 'Prof. Vint Cerf', description: 'OSI Model, TCP/IP & Socket Programming' }
  ],
  tasks: [
    { _id: 'task_1', userId: 'user_demo_123', title: 'Complete OS Notes', description: 'Finish chapter 4 process synchronization', dueDate: new Date('2026-09-20'), priority: 'High', status: 'In Progress' },
    { _id: 'task_2', userId: 'user_demo_123', title: 'Prepare for Finance Quiz', description: 'Review budget calculations & balance sheet', dueDate: new Date('2026-09-22'), priority: 'Medium', status: 'Pending' },
    { _id: 'task_3', userId: 'user_demo_123', title: 'Design Web Project UI', description: 'Create responsive dashboards and theme components', dueDate: new Date('2026-09-25'), priority: 'High', status: 'Completed' }
  ],
  notes: [
    { _id: 'note_1', userId: 'user_demo_123', title: 'DBMS Normalization', content: '1NF: Atomic values.\n2NF: No partial dependencies.\n3NF: No transitive dependencies.', subject: 'DBMS', tags: ['sql', 'database'], createdAt: new Date() },
    { _id: 'note_2', userId: 'user_demo_123', title: 'React Hooks Overview', content: 'useState for state.\nuseEffect for side effects.\nuseContext for global state.', subject: 'Web Development', tags: ['react', 'javascript'], createdAt: new Date() }
  ],
  exams: [
    { _id: 'exam_1', userId: 'user_demo_123', examName: 'DBMS Midterm Exam', subject: 'DBMS', date: new Date('2026-10-05'), time: '09:00 AM', room: 'Hall B', description: 'Covering SQL & normalization' },
    { _id: 'exam_2', userId: 'user_demo_123', examName: 'Operating Systems Final', subject: 'Operating Systems', date: new Date('2026-10-12'), time: '11:30 AM', room: 'Lab 4', description: 'Process management' }
  ],
  resources: [
    { _id: 'res_1', userId: 'user_demo_123', title: 'React Official Docs', url: 'https://react.dev', type: 'Documentation', subject: 'Web Development', description: 'Modern React reference' },
    { _id: 'res_2', userId: 'user_demo_123', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'Website', subject: 'Web Development', description: 'JavaScript API reference' }
  ]
};

module.exports = inMemoryStore;
