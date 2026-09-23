# Student Life OS 🚀

**Student Life OS** is a production-ready, full-stack student productivity dashboard and study operating system built with React, Express, Node.js, Tailwind CSS, and MongoDB.

Inspired by modern student productivity workflows, Student Life OS brings together course subjects, task tracking, notes management, exam timetables, study bookmarks, interactive tools (Calculator, Live Code Sandbox, Flowcharts, PDF Hub), and dark mode.

---

## 🌟 Key Features

- 📊 **Dynamic Dashboard**: Dynamic statistical cards for Subjects, Tasks, Notes, and Exams, calculated live from MongoDB.
- 🔐 **JWT Authentication & Security**: Secure signup, login, profile management, password change with `bcryptjs` password hashing and protected JWT endpoints.
- 📝 **Notes Manager**: Full CRUD, tag search, subject filtering, note title & markdown content.
- ✅ **Task Management**: Priority tags (High, Medium, Low), status tracking (Pending, In Progress, Completed), search, sorting by due dates.
- 📚 **Subject & Course Hub**: Course code, instructor info, description, and module organization.
- 🎓 **Exam Schedule**: Timetable tracking with date, time, venue room, description, and countdowns.
- 🔖 **Resource Manager**: Bookmark organizer for PDFs, Videos, Websites, Documentation, and GitHub repositories with direct links.
- 🛠️ **Interactive Student Tools**:
  - **Calculator**: Fully functional interactive math calculator.
  - **Code Editor**: Live HTML/CSS/JavaScript sandbox editor with real-time output preview.
  - **Flowcharts**: Node-based step builder for study workflow diagrams.
  - **PDF Notes Hub**: Study PDF library manager.
- 🌙 **Dark Mode**: Smooth light and dark theme toggle with `localStorage` persistence.
- 📱 **Responsive Design**: Fixed sidebar on desktop, collapsible menu drawer on mobile, and responsive cards.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Auth**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Security & Config**: `cors`, `dotenv`

---

## 📁 Project Structure

```
student-life-os/
├── client/              # React Vite Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── SubjectCard.jsx
│   │   │   ├── ExamCard.jsx
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Subjects.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── Exams.jsx
│   │   │   ├── Tools.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── server/              # Express Node.js Backend API
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── taskController.js
    │   ├── noteController.js
    │   ├── subjectController.js
    │   ├── examController.js
    │   └── resourceController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Task.js
    │   ├── Note.js
    │   ├── Subject.js
    │   ├── Exam.js
    │   └── Resource.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── taskRoutes.js
    │   ├── noteRoutes.js
    │   ├── subjectRoutes.js
    │   ├── examRoutes.js
    │   └── resourceRoutes.js
    ├── seed.js
    ├── .env.example
    ├── server.js
    └── package.json
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student-life-os
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run Locally

### 1. MongoDB Setup
Ensure MongoDB is running locally on port 27017, or set `MONGO_URI` in `server/.env` to your MongoDB Atlas connection string.

### 2. Seed Sample Data (Optional)
To populate demo subjects, tasks, notes, exams, and resources:
```bash
cd server
npm run seed
```
> Demo Login: `demo@student.com` | Password: `password123`

### 3. Run Backend Server
```bash
cd server
npm install
npm run dev
```
Backend API will start at: `http://localhost:5000`

### 4. Run Frontend Client
```bash
cd client
npm install
npm run dev
```
Frontend web application will open at: `http://localhost:5173`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile info | Yes |
| `PUT` | `/api/auth/change-password` | Update user password | Yes |
| `GET` | `/api/dashboard/stats` | Dynamic stats (counts) | Yes |
| `GET` / `POST` | `/api/tasks` | Get all tasks / Create task | Yes |
| `PUT` / `DELETE`| `/api/tasks/:id` | Update / Delete task | Yes |
| `GET` / `POST` | `/api/notes` | Get all notes / Create note | Yes |
| `PUT` / `DELETE`| `/api/notes/:id` | Update / Delete note | Yes |
| `GET` / `POST` | `/api/subjects` | Get subjects / Add subject | Yes |
| `PUT` / `DELETE`| `/api/subjects/:id` | Update / Delete subject | Yes |
| `GET` / `POST` | `/api/exams` | Get exams / Add exam | Yes |
| `PUT` / `DELETE`| `/api/exams/:id` | Update / Delete exam | Yes |
| `GET` / `POST` | `/api/resources` | Get resources / Add resource | Yes |
| `PUT` / `DELETE`| `/api/resources/:id` | Update / Delete resource | Yes |

---

## 🚢 Deployment Instructions

1. **Backend Deployment (e.g. Render / Railway / Heroku)**:
   - Deploy `server/` directory.
   - Set environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`, and `FRONTEND_URL`).
   - Use a managed MongoDB database. Production startup fails if MongoDB or `JWT_SECRET` is unavailable.
2. **Frontend Deployment (e.g. Vercel / Netlify)**:
   - Deploy `client/` directory.
   - Set environment variable `VITE_API_URL` to your production backend API domain (e.g., `https://your-api.onrender.com/api`).
