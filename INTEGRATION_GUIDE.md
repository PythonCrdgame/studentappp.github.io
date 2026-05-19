# Integration Examples

This file contains code snippets to integrate the attendance system into your existing React app.

## 1. Update App.js

Add this import at the top:
```javascript
import AttendancePage from './pages/Attendance';
```

Find the section in App.js where pages are rendered (look for the return statement with page === conditions). Add this case:

```javascript
if (!user || page === 'auth') {
  return <Auth onLogin={handleLogin} />;
}

return (
  <>
    <Navbar
      currentPage={page}
      onNavigate={navigate}
      user={user}
      onLogout={handleLogout}
      tick={tick}
    />
    {page === 'home' && <Home user={user} refresh={refresh} />}
    {page === 'classes' && <MyClasses user={user} refresh={refresh} />}
    {page === 'enroll' && <Enroll user={user} refresh={refresh} />}
    {page === 'contact' && <Contact />}
    {page === 'profile' && <Profile user={user} refresh={refresh} />}
    {page === 'teacher' && <TeacherDashboard user={user} />}
    
    {/* ADD THIS LINE FOR ATTENDANCE PAGE */}
    {page === 'attendance' && <AttendancePage user={user} />}
    
    <Footer onNavigate={navigate} />
  </>
);
```

## 2. Update Navbar.jsx

Find where navigation buttons are rendered and add this for students:

```javascript
{/* Existing navigation buttons */}
{currentPage !== 'auth' && (
  <>
    {user?.role === 'student' && (
      <>
        <button 
          className={currentPage === 'home' ? 'nav-active' : ''}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button 
          className={currentPage === 'classes' ? 'nav-active' : ''}
          onClick={() => onNavigate('classes')}
        >
          Classes
        </button>
        <button 
          className={currentPage === 'enroll' ? 'nav-active' : ''}
          onClick={() => onNavigate('enroll')}
        >
          Enroll
        </button>
        
        {/* ADD THIS BUTTON */}
        <button 
          className={currentPage === 'attendance' ? 'nav-active' : ''}
          onClick={() => onNavigate('attendance')}
        >
          Attendance
        </button>
        
        <button 
          className={currentPage === 'contact' ? 'nav-active' : ''}
          onClick={() => onNavigate('contact')}
        >
          Contact
        </button>
      </>
    )}
    
    {user?.role === 'teacher' && (
      <button 
        className={currentPage === 'teacher' ? 'nav-active' : ''}
        onClick={() => onNavigate('teacher')}
      >
        Dashboard
      </button>
    )}
  </>
)}
```

## 3. Update TeacherDashboard.jsx

Add this import at the top:
```javascript
import AttendanceOverview from '../components/AttendanceOverview';
```

Add this after the stats section in TeacherDashboard:

```javascript
{/* Existing code... */}

{/* Add this section after stats */}
<div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #eee' }}>
  <div className="dashboard-section-title">
    <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
      Student Attendance
    </h2>
    <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
      Monitor attendance for your classes
    </p>
  </div>
  
  <AttendanceOverview user={user} teacherClasses={displayClasses} />
</div>

{/* Rest of component continues... */}
```

## 4. Optional: Add Attendance Stats to Profile Page

In Profile.jsx, you can add attendance stats for each class:

```javascript
// Add this import
import { getStudentAttendanceStats } from '../services/api';

// In the component state
const [attendanceStats, setAttendanceStats] = useState({});

// In useEffect or when loading classes
useEffect(() => {
  const fetchStats = async () => {
    const stats = {};
    for (const classId of user.enrolledClassIds) {
      try {
        const stat = await getStudentAttendanceStats(user.id, classId);
        stats[classId] = stat;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    setAttendanceStats(stats);
  };
  
  if (user?.enrolledClassIds?.length > 0) {
    fetchStats();
  }
}, [user]);

// In the JSX where you show enrolled classes, add:
<div className="attendance-stat">
  <p>Attendance: {attendanceStats[classId]?.percentage || '-'}%</p>
</div>
```

## 5. Optional: Add to MyClasses Page

In MyClasses.jsx, you can add quick attendance marking:

```javascript
// After each class card, you can add:
<div className="class-quick-actions">
  <button 
    onClick={() => navigate('attendance')}
    className="quick-action-btn"
  >
    Mark Attendance
  </button>
</div>
```

## Environment Setup

### Frontend .env file (root directory)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend .env file (backend directory)
```
MONGODB_URI=mongodb://localhost:27017/student-app
PORT=5000
NODE_ENV=development
```

## Running Everything

```bash
# Terminal 1: Start MongoDB
mongod
# or
brew services start mongodb-community

# Terminal 2: Start Backend
cd backend
npm install
npm run dev

# Terminal 3: Start Frontend
npm start
```

## Testing the Integration

1. Login as student: student@school.edu / password123
2. Click "Attendance" in navbar
3. Select a class (Calculus II)
4. Mark present or absent
5. See the record appear in history
6. Login as teacher: teacher@school.edu / teach2026
7. Go to Dashboard
8. Scroll to "Student Attendance" section
9. Select a class and date to see attendance records

## CSS Integration Notes

The CSS files are self-contained and won't conflict with existing styles. They use:
- CSS custom properties (--primary, --text-primary, etc.) for theming
- Flex and Grid layouts (modern browsers only)
- Responsive design (mobile-friendly)

If you need to customize colors, you can:
1. Update CSS variables in global.css
2. Or override specific classes in your existing CSS

## Troubleshooting Integration

**Import Errors:**
- Ensure AttendancePage is in src/pages/
- Ensure Attendance component is in src/components/
- Check that api.js is in src/services/

**Backend Not Responding:**
- Check that backend server is running
- Verify REACT_APP_API_URL in .env matches backend port
- Check browser console for CORS or network errors

**MongoDB Issues:**
- Ensure mongod is running
- Check connection string in backend/.env
- Use mongosh to verify database exists

**CSS Not Loading:**
- Ensure CSS files are in src/styles/
- Check that component imports reference correct CSS file path
- Check browser DevTools for 404 errors

## What to Change in Your Code

**Minimum Changes Required:**
1. Add 1 import to App.js
2. Add 1 case to App.js render
3. Add 1 button to Navbar.jsx
4. Add 2 lines to TeacherDashboard.jsx (import + component)

**That's it!** The system will work with your existing code.
