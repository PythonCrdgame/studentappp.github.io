# Quick Start Guide - Attendance System

## 1. Start MongoDB

**Windows:**
```bash
# If MongoDB is installed locally, open Command Prompt and run:
mongod

# Or if you have MongoDB as a service:
net start MongoDB
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Cloud (MongoDB Atlas):**
- No setup needed, just ensure your .env has the correct connection string

## 2. Start Backend Server

```bash
cd backend
npm install  # (first time only)
npm run dev
```

Wait for: `Server is running on http://localhost:5000`

## 3. Start Frontend Server (in another terminal)

```bash
npm start  # (in root directory)
```

Your app opens at: `http://localhost:3000`

## 4. Test the System

1. **Login as Student**
   - Email: `student@school.edu`
   - Password: `password123`

2. **Navigate to Attendance** (once integrated in navbar)
   - Select a class (e.g., Calculus II)
   - Click "Mark Present" or "Mark Absent"
   - View attendance history

3. **Login as Teacher**
   - Email: `teacher@school.edu`
   - Password: `teach2026`

4. **View Attendance in Teacher Dashboard** (once integrated)
   - See attendance records by date
   - View summary statistics

## 5. Integration Steps

### Step 1: Update App.js Navigation

Find the section with page routing in App.js and add attendance page:

```javascript
// Add this import at the top
import AttendancePage from './pages/Attendance';

// In the render/return section with other pages, add:
case 'attendance':
  return <AttendancePage user={user} />;
```

### Step 2: Update Navbar.jsx

Add attendance link for students:

```javascript
// In the navigation buttons section, add:
{currentPage === 'attendance' && (
  <button onClick={() => onNavigate('attendance')} className="nav-btn active">
    Attendance
  </button>
)}

// Or use a conditional for students only:
{user?.role === 'student' && (
  <button onClick={() => onNavigate('attendance')} className="nav-btn">
    Attendance
  </button>
)}
```

### Step 3: Update TeacherDashboard.jsx

Add attendance overview for teachers:

```javascript
// Add this import
import AttendanceOverview from '../components/AttendanceOverview';

// In the component JSX, add after the stats section:
{/* Attendance Overview Section */}
<div style={{ marginTop: 40 }}>
  <AttendanceOverview user={user} teacherClasses={displayClasses} />
</div>
```

## API Testing (Optional)

Use curl or Postman to test endpoints:

```bash
# Test 1: Mark attendance
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -d '{"studentId":"u1","classId":1,"date":"2024-05-18","status":"present"}'

# Test 2: Get attendance for a date
curl "http://localhost:5000/api/attendance/class/date?classId=1&date=2024-05-18"

# Test 3: Get student stats
curl "http://localhost:5000/api/attendance/stats/u1/class/1"
```

## Verify Everything Works

✅ MongoDB is running
✅ Backend server (http://localhost:5000/api/health returns status)
✅ Frontend app (http://localhost:3000)
✅ Can login with test credentials
✅ Can mark attendance
✅ Teacher can view attendance
✅ Data persists (refresh page and data is still there)

## Useful Commands

```bash
# Check if MongoDB is running (macOS/Linux)
ps aux | grep mongod

# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # macOS/Linux

# Kill process on port 5000
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # macOS/Linux

# View MongoDB databases
mongosh
> show dbs
> use student-app
> db.users.find()
```

## Need Help?

- **Backend logs**: Check terminal where backend is running
- **Frontend logs**: Check browser console (F12)
- **Database**: Use MongoDB Compass (GUI tool) or mongosh (CLI)
- **API errors**: Network tab in browser DevTools
