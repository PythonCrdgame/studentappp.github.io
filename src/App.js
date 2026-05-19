import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyClasses from './pages/MyClasses';
import Enroll from './pages/Enroll';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import TeacherDashboard from './pages/TeacherDashboard';
import AttendancePage from './pages/Attendance';
import { getUserById } from './services/api';
import './styles/global.css';

const App = () => {
  const [page, setPage] = useState('auth');
  const [user, setUser] = useState(null);
  const [tick, setTick] = useState(0);

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refresh = async () => {
    if (!user?._id) return;
    try {
      const latest = await getUserById(user._id);
      setUser(latest);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setTick(t => t + 1);
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    navigate(loggedInUser.role === 'teacher' ? 'teacher' : 'home');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('auth');
  };

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

      {user.role === 'teacher' ? (
        <TeacherDashboard user={user} />
      ) : (
        <>
          {page === 'home'       && <Home    user={user} onNavigate={navigate} tick={tick} />}
          {page === 'classes'    && <MyClasses user={user} onNavigate={navigate} onRefresh={refresh} />}
          {page === 'enroll'     && <Enroll  user={user} onNavigate={navigate} onRefresh={refresh} />}
          {page === 'attendance' && <AttendancePage user={user} />}
          {page === 'contact'    && <Contact />}
          {page === 'profile'    && <Profile user={user} onRefresh={refresh} onNavigate={navigate} />}
        </>
      )}

      <Footer />
    </>
  );
};

export default App;