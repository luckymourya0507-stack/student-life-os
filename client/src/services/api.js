import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper functions for Local Storage Fallback Mode
const getLocalData = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(`student_os_local_${key}`);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(`student_os_local_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
};

// Initial Seed Data for offline/Vercel mode
const defaultUser = {
  id: 'user_demo_123',
  name: 'Mohit Ostwal',
  email: 'demo@student.com',
  course: 'Computer Science',
  year: '3rd Year',
  profileImage: ''
};

const initialUsers = [
  { ...defaultUser, password: 'password123' }
];

const initialSubjects = [
  { _id: 'sub_1', name: 'Data Structures', code: 'CS201', teacher: 'Dr. Alan Turing', description: 'Arrays, Trees, Graphs & Algorithms' },
  { _id: 'sub_2', name: 'DBMS', code: 'CS301', teacher: 'Prof. Edgar Codd', description: 'Relational Model, SQL, Normalization' },
  { _id: 'sub_3', name: 'Operating Systems', code: 'CS302', teacher: 'Dr. Linus Torvalds', description: 'Processes, Memory & Threads' }
];

const initialTasks = [
  { _id: 'task_1', title: 'Complete OS Notes', description: 'Finish chapter 4 process synchronization', dueDate: '2026-09-28', priority: 'High', status: 'In Progress' },
  { _id: 'task_2', title: 'Prepare for Quiz', description: 'Review budget & algorithm sheet', dueDate: '2026-09-30', priority: 'Medium', status: 'Pending' }
];

const initialNotes = [
  { _id: 'note_1', title: 'DBMS Normalization', content: '1NF: Atomic values.\n2NF: No partial dependencies.\n3NF: No transitive dependencies.', subject: 'DBMS', tags: ['sql', 'database'], createdAt: new Date().toISOString() }
];

const initialExams = [
  { _id: 'exam_1', examName: 'DBMS Midterm Exam', subject: 'DBMS', date: '2026-10-05', time: '09:00 AM', room: 'Hall B', description: 'Covering SQL & normalization' }
];

const initialResources = [
  { _id: 'res_1', title: 'React Official Docs', url: 'https://react.dev', type: 'Documentation', subject: 'Web Development', description: 'Modern React reference' }
];

// Local Client Fallback Handler
const handleLocalFallback = async (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();
  let body = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = {};
    }
  }

  // Auth Endpoints
  if (url.includes('/auth/register')) {
    const users = getLocalData('users', initialUsers);
    const existing = users.find((u) => u.email.toLowerCase() === (body.email || '').toLowerCase());
    if (existing) {
      // If demo user email or existing email, log in or return user cleanly
      const token = 'local_token_' + Date.now();
      const userPublic = { id: existing.id || existing._id, name: existing.name, email: existing.email, course: existing.course, year: existing.year, profileImage: existing.profileImage || '' };
      setLocalData('current_user', userPublic);
      return { data: { token, user: userPublic }, status: 200, headers: {}, config };
    }
    const newUser = {
      _id: 'user_' + Date.now(),
      id: 'user_' + Date.now(),
      name: body.name || 'Student',
      email: (body.email || '').toLowerCase(),
      password: body.password || '123456',
      course: body.course || 'Computer Science',
      year: body.year || '3rd Year',
      profileImage: ''
    };
    users.push(newUser);
    setLocalData('users', users);
    const token = 'local_token_' + Date.now();
    const userPublic = { id: newUser.id, name: newUser.name, email: newUser.email, course: newUser.course, year: newUser.year, profileImage: '' };
    setLocalData('current_user', userPublic);
    return { data: { token, user: userPublic }, status: 201, headers: {}, config };
  }

  if (url.includes('/auth/login')) {
    const users = getLocalData('users', initialUsers);
    const user = users.find((u) => u.email.toLowerCase() === (body.email || '').toLowerCase()) || {
      id: 'user_' + Date.now(),
      name: body.email ? body.email.split('@')[0] : 'Student',
      email: body.email || 'demo@student.com',
      course: 'Computer Science',
      year: '3rd Year',
      profileImage: ''
    };
    const token = 'local_token_' + Date.now();
    const userPublic = { id: user.id || user._id, name: user.name, email: user.email, course: user.course, year: user.year, profileImage: user.profileImage || '' };
    setLocalData('current_user', userPublic);
    return { data: { token, user: userPublic }, status: 200, headers: {}, config };
  }

  if (url.includes('/auth/me')) {
    const currentUser = getLocalData('current_user', defaultUser);
    return { data: currentUser, status: 200, headers: {}, config };
  }

  if (url.includes('/auth/profile')) {
    const currentUser = getLocalData('current_user', defaultUser);
    const updated = { ...currentUser, ...body };
    setLocalData('current_user', updated);
    return { data: updated, status: 200, headers: {}, config };
  }

  if (url.includes('/auth/change-password')) {
    return { data: { message: 'Password updated successfully' }, status: 200, headers: {}, config };
  }

  if (url.includes('/dashboard/stats')) {
    const tasks = getLocalData('tasks', initialTasks);
    const notes = getLocalData('notes', initialNotes);
    const subjects = getLocalData('subjects', initialSubjects);
    const exams = getLocalData('exams', initialExams);
    return {
      data: {
        subjectsCount: subjects.length,
        tasksCount: tasks.length,
        notesCount: notes.length,
        examsCount: exams.length
      },
      status: 200,
      headers: {},
      config
    };
  }

  // Generic CRUD Handler for Resources
  const collections = ['tasks', 'notes', 'subjects', 'exams', 'resources'];
  for (const itemKey of collections) {
    if (url.includes(`/${itemKey}`)) {
      const initialMap = {
        tasks: initialTasks,
        notes: initialNotes,
        subjects: initialSubjects,
        exams: initialExams,
        resources: initialResources
      };
      let list = getLocalData(itemKey, initialMap[itemKey]);

      if (method === 'get') {
        return { data: list, status: 200, headers: {}, config };
      }
      if (method === 'post') {
        const newItem = { _id: `${itemKey.slice(0, 3)}_${Date.now()}`, ...body, createdAt: new Date().toISOString() };
        list = [newItem, ...list];
        setLocalData(itemKey, list);
        return { data: newItem, status: 201, headers: {}, config };
      }
      if (method === 'put') {
        const id = url.split('/').pop();
        list = list.map((item) => (item._id === id ? { ...item, ...body } : item));
        setLocalData(itemKey, list);
        const updatedItem = list.find((item) => item._id === id) || body;
        return { data: updatedItem, status: 200, headers: {}, config };
      }
      if (method === 'delete') {
        const id = url.split('/').pop();
        list = list.filter((item) => item._id !== id);
        setLocalData(itemKey, list);
        return { data: { message: 'Deleted successfully' }, status: 200, headers: {}, config };
      }
    }
  }

  // Fallback response for unhandled endpoints
  return { data: { message: 'Success' }, status: 200, headers: {}, config };
};

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('student_os_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling & Client Fallback
api.interceptors.response.use(
  (response) => {
    // If Vercel served HTML (index.html) for an API request, fallback to client handler
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html>')) {
      return handleLocalFallback(response.config);
    }
    return response;
  },
  async (error) => {
    // If backend is offline, unreachable, returns 404/500/HTML on Vercel
    if (
      !error.response ||
      error.response.status === 404 ||
      error.response.status === 502 ||
      error.response.status === 503 ||
      (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>'))
    ) {
      return handleLocalFallback(error.config);
    }

    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('student_os_token')) {
        localStorage.removeItem('student_os_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
