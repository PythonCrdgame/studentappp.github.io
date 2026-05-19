import React, { useState } from 'react';
import Attendance from '../components/Attendance';
import { ALL_CLASSES } from '../store';
import '../styles/pages.css';

const AttendancePage = ({ user }) => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Get classes the student is enrolled in
  const studentClasses = ALL_CLASSES.filter(c =>
    user.enrolledClassIds.includes(c.id)
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Class Attendance</h1>
          <p>Mark your attendance for each class session</p>
        </div>

        {/* Class Selection */}
        <div className="classes-selector">
          <h3>Select a Class:</h3>
          <div className="class-cards">
            {studentClasses.length > 0 ? (
              studentClasses.map(cls => (
                <div
                  key={cls.id}
                  className={`class-card ${selectedClass?.id === cls.id ? 'selected' : ''}`}
                  onClick={() => setSelectedClass(cls)}
                  style={{
                    borderLeftColor: cls.color,
                    cursor: 'pointer',
                  }}
                >
                  <div className="class-card-content">
                    <div className="class-title">{cls.title}</div>
                    <div className="class-teacher">{cls.teacher}</div>
                    <div className="class-schedule">{cls.schedule}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-classes-message">
                You're not enrolled in any classes yet. Enroll in classes to mark attendance.
              </p>
            )}
          </div>
        </div>

        {/* Attendance Component */}
        {selectedClass && (
          <Attendance user={user} currentClass={selectedClass} />
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
