# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT APP SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND (React)          BACKEND (Express.js)  DATABASE       │
│  ────────────────          ──────────────────    ────────       │
│                                                                 │
│  Attendance Page      →    /api/attendance   →   Attendance    │
│  (Student marks       →    (POST/GET routes) →   Collection    │
│   present/absent)     →                         (MongoDB)      │
│                                                                 │
│  AttendanceOverview   →    /api/users        →   Users         │
│  (Teacher views       →    (Login/Register)  →   Collection    │
│   attendance)         →                                        │
│                                                                 │
│                       →    /api/classes       →  Classes       │
│                       →    (Course catalog)   →  Collection    │
│                                                                 │
│  Student/Teacher      →    Controllers        →               │
│  Profiles      →          (Business Logic)                    │
│  (Show stats)          →                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App.js (Main Component)
├── Navbar (Navigation)
│   └── Attendance Link (for students)
├── AuthPage (Login/Register)
├── HomePage
├── ClassesPage
├── EnrollPage
├── ProfilePage
├── AttendancePage ← NEW
│   └── Attendance.jsx ← NEW
│       ├── Mark Present/Absent buttons
│       ├── Attendance statistics
│       └── History display
├── TeacherDashboard
│   └── AttendanceOverview.jsx ← NEW
│       ├── Date selector
│       ├── Summary view
│       └── Attendance records
└── Footer

Services/
└── api.js ← NEW (API client)
    ├── markAttendance()
    ├── getClassAttendanceByDate()
    ├── getStudentAttendance()
    └── ... (other endpoints)
```

### Backend Architecture

```
Express Server (localhost:5000)
│
├── Routes
│   ├── userRoutes.js
│   │   ├── POST /register
│   │   ├── POST /login
│   │   ├── GET /all
│   │   ├── GET /:userId
│   │   ├── POST /enroll
│   │   └── POST /unenroll
│   │
│   └── attendanceRoutes.js
│       ├── POST /mark
│       ├── GET /class/date
│       ├── GET /class/:classId
│       ├── GET /student/:studentId/class/:classId
│       ├── GET /stats/:studentId/class/:classId
│       └── GET /teacher/:teacherId
│
├── Controllers
│   ├── userController.js
│   │   ├── register()
│   │   ├── login()
│   │   ├── getUserById()
│   │   ├── getAllUsers()
│   │   ├── enrollInClass()
│   │   ├── unenrollFromClass()
│   │   └── getClasses()
│   │
│   └── attendanceController.js
│       ├── markAttendance()
│       ├── getClassAttendanceByDate()
│       ├── getClassAttendanceSummary()
│       ├── getStudentAttendance()
│       ├── getStudentAttendanceStats()
│       └── getTeacherAttendanceByDate()
│
└── Models
    ├── db.js
    │   ├── connectDB()
    │   ├── getDB()
    │   └── disconnectDB()
    │
    ├── User.js
    │   ├── getUserById()
    │   ├── getUsers()
    │   ├── findUser()
    │   ├── registerUser()
    │   ├── loginUser()
    │   ├── getAllClasses()
    │   ├── getClassById()
    │   ├── enrollUserInClass()
    │   └── unenrollUserFromClass()
    │
    └── Attendance.js
        ├── markAttendance()
        ├── getStudentAttendance()
        ├── getClassAttendanceByDate()
        ├── getClassAttendanceSummary()
        ├── getTeacherAttendanceByDate()
        └── getStudentAttendanceStats()
```

### Database Schema

```
MongoDB (student-app)
│
├── Users Collection
│   ├── _id (String)
│   ├── name (String)
│   ├── email (String)
│   ├── password (String)
│   ├── role ('student' | 'teacher')
│   ├── enrolledClassIds (Array<Number>)
│   └── activity (Array<Object>)
│
├── Classes Collection
│   ├── id (Number)
│   ├── subject (String)
│   ├── title (String)
│   ├── teacher (String)
│   ├── teacherId (String)
│   ├── schedule (String)
│   ├── room (String)
│   ├── color (String)
│   ├── seats (Number)
│   ├── image (String)
│   └── description (String)
│
└── Attendance Collection
    ├── _id (ObjectId)
    ├── studentId (String)
    ├── classId (Number)
    ├── date (Date)
    ├── status ('present' | 'absent')
    ├── createdAt (Date)
    └── updatedAt (Date)
    [Indexes: classId+date, studentId+classId]
```

## Data Flow

### Student Marking Attendance

```
1. Student selects class from dropdown
   ↓
2. Student selects date and clicks "Mark Present/Absent"
   ↓
3. Frontend calls api.markAttendance()
   ↓
4. API sends: POST /api/attendance/mark
   {studentId, classId, date, status}
   ↓
5. Backend attendanceController.markAttendance()
   ↓
6. Model checks if record exists
   - If yes: UPDATE record
   - If no: INSERT new record
   ↓
7. Response sent back to frontend
   ↓
8. Component re-fetches attendance history
   ↓
9. UI updates with latest data
```

### Teacher Viewing Attendance

```
1. Teacher logs in → navigates to Dashboard
   ↓
2. AttendanceOverview component loads
   ↓
3. Frontend calls api.getClassAttendanceByDate()
   ↓
4. Backend queries attendance collection
   WHERE classId = selectedClass AND date = selectedDate
   ↓
5. Response includes all student records for that date
   ↓
6. Teacher can switch between "By Date" and "Summary" views
   ↓
7. Stats are calculated and displayed
   - Present count
   - Absent count
   - Total records
```

## Technology Stack

```
Frontend:
├── React 18.2.0
├── JavaScript (ES6+)
├── CSS3 (Flexbox, Grid)
└── Fetch API (for HTTP requests)

Backend:
├── Node.js
├── Express.js 4.18.2
├── MongoDB 6.3.0
├── CORS middleware
└── Body Parser middleware

Database:
├── MongoDB (NoSQL)
├── Collections: users, classes, attendance
└── Indexes for performance

Development:
├── npm (package manager)
├── Nodemon (auto-restart)
└── .env (configuration)
```

## Request/Response Flow Example

### Marking Attendance

**Request:**
```javascript
POST http://localhost:5000/api/attendance/mark
Content-Type: application/json

{
  "studentId": "u1",
  "classId": 1,
  "date": "2024-05-18",
  "status": "present"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Marked present for 2024-05-18",
  "attendance": {
    "_id": "507f1f77bcf86cd799439011",
    "studentId": "u1",
    "classId": 1,
    "date": "2024-05-18T00:00:00.000Z",
    "status": "present",
    "createdAt": "2024-05-18T10:30:00.000Z",
    "updatedAt": "2024-05-18T10:30:00.000Z"
  }
}
```

## Scalability Considerations

### Current Setup (Single Server)
- Works for classroom/school size usage
- MongoDB runs locally or cloud
- Frontend served by development server

### Future Enhancements
- API authentication (JWT tokens)
- User roles and permissions
- Attendance notifications
- PDF report generation
- Mobile app version
- QR code based attendance
- Biometric integration
- Email/SMS notifications
- Batch attendance operations
- Advanced analytics

## Security Notes

Current implementation:
- ✅ CORS enabled
- ✅ Error handling implemented
- ✅ Input validation on backend

For production, add:
- 🔒 JWT authentication
- 🔒 Password hashing (bcrypt)
- 🔒 HTTPS/TLS
- 🔒 Rate limiting
- 🔒 SQL injection prevention
- 🔒 CSRF protection
- 🔒 Input sanitization

## Performance Optimization

Current setup includes:
- ✅ MongoDB indexes on frequently queried fields
- ✅ Efficient date-based queries
- ✅ User enrollment caching in memory
- ✅ Responsive CSS with media queries

Potential improvements:
- Implement pagination for large datasets
- Add caching layer (Redis)
- Lazy load components
- Optimize bundle size
- Implement service workers
