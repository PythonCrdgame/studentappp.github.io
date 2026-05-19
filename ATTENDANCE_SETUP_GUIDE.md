# Attendance System Setup Guide

## Overview
This system allows students to mark their attendance for classes, and teachers can view their students' attendance records. The system uses MongoDB for data persistence, Express.js for the backend API, and React for the frontend.

## Project Structure

```
studentapp/
├── backend/                      # Node.js/Express backend
│   ├── models/
│   │   ├── db.js                # MongoDB connection and initialization
│   │   ├── User.js              # User and class functions
│   │   └── Attendance.js        # Attendance functions
│   ├── controllers/
│   │   ├── userController.js    # User/auth endpoints
│   │   └── attendanceController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── attendanceRoutes.js
│   ├── server.js                # Express server entry point
│   ├── package.json
│   └── .env.example
├── src/                         # React frontend
│   ├── components/
│   │   ├── Attendance.jsx       # Student attendance marking component
│   │   └── AttendanceOverview.jsx  # Teacher attendance view
│   ├── pages/
│   │   └── Attendance.jsx       # Attendance page
│   ├── services/
│   │   └── api.js               # API service client
│   ├── styles/
│   │   ├── Attendance.css
│   │   ├── AttendanceOverview.css
│   │   └── AttendancePage.css
│   └── ...
└── ...
```

## Setup Instructions

### Prerequisites
- Node.js (v14+) and npm
- MongoDB (v4.4+) installed and running locally, or MongoDB Atlas cloud account
- Git (optional)

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Windows (if installed)
net start MongoDB

# Or use MongoDB compass if installed
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Note: Update `.env` with your Atlas connection string

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
copy .env.example .env

# Edit .env file with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/student-app
# (or your MongoDB Atlas URI)

# Start the server
npm run dev
# Or for production: npm start

# Server runs on http://localhost:5000
```

The backend will:
- Connect to MongoDB
- Create necessary collections (users, classes, attendance)
- Seed initial data (users and classes)

### 3. Frontend Setup

```bash
# In the root project directory (where package.json is)

# Install dependencies
npm install

# Create .env file (if needed)
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start the development server
npm start

# Frontend runs on http://localhost:3000
```

### 4. Test the System

**Login Credentials:**
- **Student**: 
  - Email: student@school.edu
  - Password: password123
  
- **Teacher**:
  - Email: teacher@school.edu
  - Password: teach2026

## Features

### For Students
1. **Mark Attendance**: Select a class and mark themselves present or absent
2. **View History**: See their attendance records and statistics
3. **Attendance Percentage**: Track their attendance rate per class

### For Teachers
1. **View by Date**: See all attendance records for a specific date
2. **Summary View**: Get an overview of all attendance records
3. **Monitor Students**: Track student attendance patterns

## API Endpoints

### User Endpoints
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/all` - Get all users
- `GET /api/users/:userId` - Get user by ID
- `GET /api/users/classes/all` - Get all classes
- `POST /api/users/enroll` - Enroll user in class
- `POST /api/users/unenroll` - Unenroll user from class

### Attendance Endpoints
- `POST /api/attendance/mark` - Mark attendance (present/absent)
- `GET /api/attendance/class/date` - Get attendance for class on specific date
- `GET /api/attendance/class/:classId` - Get all attendance for a class
- `GET /api/attendance/student/:studentId/class/:classId` - Get student's attendance in a class
- `GET /api/attendance/stats/:studentId/class/:classId` - Get student's attendance stats
- `GET /api/attendance/teacher/:teacherId?date=YYYY-MM-DD` - Get teacher's classes attendance

## Database Schema

### Users Collection
```javascript
{
  _id: String,
  name: String,
  email: String,
  password: String,
  role: 'student' | 'teacher',
  enrolledClassIds: [Number],
  activity: [{
    type: String,
    classId: Number,
    className: String,
    ts: Date
  }]
}
```

### Classes Collection
```javascript
{
  id: Number,
  subject: String,
  title: String,
  teacher: String,
  teacherId: String,
  schedule: String,
  room: String,
  color: String,
  seats: Number,
  image: String,
  description: String
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  studentId: String,
  classId: Number,
  date: Date,
  status: 'present' | 'absent',
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration

The frontend components need to be integrated into your existing app:

### 1. Add Attendance Page to Navigation (in App.js)
```javascript
import AttendancePage from './pages/Attendance';

// In your navigation/routing logic:
case 'attendance':
  return <AttendancePage user={user} />;
```

### 2. Update Navbar (Navbar.jsx)
Add attendance link for students:
```javascript
{user.role === 'student' && (
  <button onClick={() => onNavigate('attendance')}>Attendance</button>
)}
```

### 3. Update TeacherDashboard (TeacherDashboard.jsx)
```javascript
import AttendanceOverview from '../components/AttendanceOverview';

// In component:
const myClasses = ALL_CLASSES.filter(c => c.teacherId === user.id);
<AttendanceOverview user={user} teacherClasses={myClasses} />
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Ensure MongoDB is running (check with `mongosh`)
- Verify connection string in .env
- For MongoDB Atlas, check IP whitelist

**Port Already in Use**
- Change PORT in .env (e.g., PORT=5001)
- Or kill process on port 5000: `lsof -ti:5000 | xargs kill -9`

**Module Not Found**
- Run `npm install` in backend directory
- Ensure all dependencies are installed

### Frontend Issues

**API Connection Error**
- Ensure backend server is running on port 5000
- Check REACT_APP_API_URL in .env
- Browser console will show the specific error

**CORS Errors**
- Verify backend has CORS enabled (cors middleware is included)
- Check that frontend URL matches backend's allowed origins

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/student-app
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Next Steps

1. ✅ Set up backend
2. ✅ Set up frontend
3. Test both simultaneously
4. Integrate components into existing app
5. Add more features (notifications, attendance reports, etc.)

## Common Next Features to Add

- Email notifications when attendance is marked
- Attendance reports/exports
- Bulk attendance marking by teacher
- Attendance alerts for low attendance students
- Parent notifications for their children's attendance
- Mobile app version
- QR code based attendance
