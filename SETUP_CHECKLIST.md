# Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Prerequisites

- [ ] Node.js installed (v14+)
- [ ] npm installed
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Text editor/IDE (VS Code, etc.)

## ✅ Backend Setup

- [ ] Verify `backend/` folder exists
- [ ] Verify `backend/package.json` exists
- [ ] Verify `backend/.env` exists with MongoDB URI
- [ ] Run `cd backend && npm install`
- [ ] Verify no errors during npm install

## ✅ MongoDB Setup

- [ ] MongoDB is running:
  - [ ] Windows: `mongod` command works
  - [ ] macOS: `brew services list` shows mongodb running
  - [ ] Linux: `systemctl status mongod` shows active
  - [ ] Cloud: MongoDB Atlas connection string ready

## ✅ Start Backend Server

- [ ] Open terminal in `backend/` directory
- [ ] Run: `npm run dev`
- [ ] Verify output: `Server is running on http://localhost:5000`
- [ ] Keep this terminal open

## ✅ Frontend Files Exist

- [ ] `src/components/Attendance.jsx` exists
- [ ] `src/components/AttendanceOverview.jsx` exists
- [ ] `src/pages/Attendance.jsx` exists
- [ ] `src/services/api.js` exists
- [ ] `src/styles/Attendance.css` exists
- [ ] `src/styles/AttendanceOverview.css` exists
- [ ] `src/styles/AttendancePage.css` exists

## ✅ Frontend Configuration

- [ ] Create `.env` file in root directory (if not exists)
- [ ] Add: `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] Verify `package.json` in root has dependencies

## ✅ Frontend Setup

- [ ] Open new terminal in root directory
- [ ] Run: `npm install` (if not done)
- [ ] Verify no errors during npm install

## ✅ Start Frontend Server

- [ ] Run: `npm start`
- [ ] Verify app opens at `http://localhost:3000`
- [ ] Verify no console errors
- [ ] Keep this terminal open

## ✅ Integration into App.js

- [ ] Open `src/App.js`
- [ ] Add import: `import AttendancePage from './pages/Attendance';`
- [ ] Add case in render: `case 'attendance': return <AttendancePage user={user} />;`
- [ ] Save file (should hot reload)

## ✅ Integration into Navbar.jsx

- [ ] Open `src/components/Navbar.jsx`
- [ ] Add attendance button for students:
  ```javascript
  {user?.role === 'student' && (
    <button onClick={() => onNavigate('attendance')}>Attendance</button>
  )}
  ```
- [ ] Save file (should hot reload)

## ✅ Integration into TeacherDashboard.jsx

- [ ] Open `src/pages/TeacherDashboard.jsx`
- [ ] Add import: `import AttendanceOverview from '../components/AttendanceOverview';`
- [ ] Add component after stats section:
  ```javascript
  <AttendanceOverview user={user} teacherClasses={displayClasses} />
  ```
- [ ] Save file (should hot reload)

## ✅ Test Student Attendance

- [ ] Frontend shows login page
- [ ] Login: student@school.edu / password123
- [ ] Click "Attendance" button in navbar
- [ ] Select "Calculus II" class
- [ ] Click "Mark Present"
- [ ] Verify message shows success
- [ ] Verify record appears in history

## ✅ Test Teacher Attendance View

- [ ] Logout or open new private/incognito window
- [ ] Login: teacher@school.edu / teach2026
- [ ] Navigate to Teacher Dashboard (or Dashboard button)
- [ ] Scroll down to "Student Attendance" section
- [ ] Verify Attendance Overview component displays
- [ ] Select "By Date" view
- [ ] Select today's date
- [ ] Verify student attendance record appears

## ✅ Test API Directly (Optional)

- [ ] Open terminal
- [ ] Test health check: `curl http://localhost:5000/api/health`
- [ ] Should return: `{"status":"Server is running"}`
- [ ] Test get classes: `curl http://localhost:5000/api/users/classes/all`
- [ ] Should return array of classes

## ✅ Verify MongoDB Data (Optional)

- [ ] Open MongoDB Compass or mongosh
- [ ] Connect to mongodb://localhost:27017/student-app
- [ ] Verify database exists
- [ ] Check collections exist: users, classes, attendance
- [ ] Verify data in attendance collection after testing

## ✅ Documentation

- [ ] Read `QUICK_START.md` (quick reference)
- [ ] Read `IMPLEMENTATION_SUMMARY.md` (what was created)
- [ ] Read `INTEGRATION_GUIDE.md` (integration details)
- [ ] Read `ATTENDANCE_SETUP_GUIDE.md` (complete guide)
- [ ] Read `SYSTEM_ARCHITECTURE.md` (how it all works)

## ✅ Common Issues & Fixes

- [ ] If attendance page not loading:
  - Check App.js has case for 'attendance'
  - Check all imports are correct
  - Check browser console for errors

- [ ] If data not saving:
  - Verify MongoDB is running
  - Check backend console for errors
  - Verify .env MongoDB URI is correct

- [ ] If API errors:
  - Verify backend server running on port 5000
  - Check CORS errors in browser console
  - Verify .env has REACT_APP_API_URL set

- [ ] If buttons not showing:
  - Verify Navbar.jsx has attendance button
  - Verify user.role is 'student' or 'teacher'
  - Check browser console for errors

## ✅ Performance Check

- [ ] Frontend loads quickly
- [ ] Buttons respond immediately
- [ ] Attendance data loads within 2 seconds
- [ ] No console warnings or errors
- [ ] Network tab shows successful API calls

## ✅ Final Verification

- [ ] All 3 terminals running:
  - [ ] MongoDB running
  - [ ] Backend running on :5000
  - [ ] Frontend running on :3000
- [ ] Student can mark attendance
- [ ] Teacher can view attendance
- [ ] Data persists after page refresh
- [ ] Multiple users can use system simultaneously

## 🎉 You're Done!

Everything should be working now. The system is ready for:
- Students to mark attendance
- Teachers to view attendance
- Data to persist in MongoDB

### Next Steps (Optional)
1. Add more features (notifications, exports, etc.)
2. Style customization
3. Add authentication tokens
4. Set up production deployment
5. Add more classes/students
6. Create admin dashboard

### Need Help?
- Check INTEGRATION_GUIDE.md for copy-paste code
- Check QUICK_START.md for commands
- Check browser console (F12) for errors
- Check backend terminal for server errors
- Check MongoDB Compass for database issues
