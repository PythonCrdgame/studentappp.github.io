import React, { useState, useEffect } from 'react';
import { ALL_CLASSES } from '../store';
import { getAllUsers } from '../services/api';
import Button from '../components/Button';
import AttendanceOverview from '../components/AttendanceOverview';
import '../styles/pages.css';

const TeacherDashboard = ({ user }) => {
  const [selected, setSelected] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Classes this teacher is listed on, or all if none assigned
  const myClasses = ALL_CLASSES.filter(c => c.teacherId === user.id);
  const displayClasses = myClasses.length > 0 ? myClasses : ALL_CLASSES;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, []);

  const getEnrolledStudents = (classId) => {
    return allUsers.filter(u => u.role === 'student' && u.enrolledClassIds.includes(classId));
  };

  const selectedStudents = selected ? getEnrolledStudents(selected.id) : [];

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Teacher hero */}
        <div className="teacher-hero">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80"
            alt="Teacher"
            className="teacher-avatar"
          />
          <div>
            <div className="home-hero-greeting">Teacher Portal</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginTop: 4 }}>{user.name}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
              Manage your courses and view enrolled students.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row" style={{ marginBottom: 32 }}>
          {[
            { img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=80&q=80', value: displayClasses.length, label: 'Total Courses' },
            { img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&q=80', value: allUsers.filter(u => u.role === 'student').length, label: 'Total Students' },
            { img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=80&q=80', value: displayClasses.reduce((s, c) => s + getEnrolledStudents(c.id).length, 0), label: 'Total Enrollments' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <img src={s.img} alt={s.label} className="stat-card-img" />
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 32 }}>
          <AttendanceOverview user={user} teacherClasses={displayClasses} />
        </div>

        <div className="home-grid" style={{ gridTemplateColumns: selected ? '1fr 1fr' : '1fr' }}>
          {/* Course list */}
          <div>
            <div className="section-title">All Courses</div>
            <div className="recent-activity">
              {displayClasses.map(cls => {
                const students = getEnrolledStudents(cls.id);
                return (
                  <div
                    key={cls.id}
                    className={`activity-item teacher-course-row${selected?.id === cls.id ? ' active-row' : ''}`}
                    onClick={() => setSelected(selected?.id === cls.id ? null : cls)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={cls.image} alt={cls.title}
                      style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    <div className="activity-info">
                      <div className="activity-title">{cls.title}</div>
                      <div className="activity-sub">{cls.subject} &middot; {cls.schedule.split('—')[0].trim()}</div>
                    </div>
                    <span className="badge badge-blue">{students.length} students</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student roster */}
          {selected && (
            <div>
              <div className="section-title">
                {selected.title} &mdash; Roster
              </div>
              <div className="recent-activity">
                {selectedStudents.length === 0 ? (
                  <div className="empty-state-inline">No students enrolled yet.</div>
                ) : selectedStudents.map(s => (
                  <div className="activity-item" key={s.id}>
                    <div className="teacher-student-avatar">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="activity-info">
                      <div className="activity-title">{s.name}</div>
                      <div className="activity-sub">{s.email}</div>
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;