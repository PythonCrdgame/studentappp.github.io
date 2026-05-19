import React, { useState, useEffect } from 'react';
import { getClassAttendanceByDate, getClassAttendanceSummary } from '../services/api';
import Button from './Button';
import '../styles/AttendanceOverview.css';

const AttendanceOverview = ({ user, teacherClasses }) => {
  const [selectedClass, setSelectedClass] = useState(teacherClasses?.[0] || null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('date'); // 'date' or 'summary'

  useEffect(() => {
    if (selectedClass) {
      fetchAttendanceData();
    }
  }, [selectedClass, selectedDate, view]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      if (view === 'date') {
        const data = await getClassAttendanceByDate(selectedClass.id, selectedDate);
        setAttendanceData(data.attendance || []);
      } else {
        const data = await getClassAttendanceSummary(selectedClass.id);
        setAttendanceData(data.attendance || []);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!teacherClasses || teacherClasses.length === 0) {
    return (
      <div className="no-classes">
        <p>You are not assigned to any classes yet.</p>
      </div>
    );
  }

  return (
    <div className="attendance-overview-container">
      <div className="overview-header">
        <h2>Attendance Overview</h2>
        <p>Monitor your students' attendance records</p>
      </div>

      {/* Controls */}
      <div className="overview-controls">
        <div className="control-group">
          <label htmlFor="class-select">Select Class:</label>
          <select
            id="class-select"
            value={selectedClass?.id || ''}
            onChange={(e) => {
              const cls = teacherClasses.find(c => c.id === parseInt(e.target.value));
              setSelectedClass(cls);
            }}
          >
            {teacherClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.title}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>View Mode:</label>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${view === 'date' ? 'active' : ''}`}
              onClick={() => setView('date')}
            >
              By Date
            </button>
            <button
              className={`toggle-btn ${view === 'summary' ? 'active' : ''}`}
              onClick={() => setView('summary')}
            >
              Summary
            </button>
          </div>
        </div>

        {view === 'date' && (
          <div className="control-group">
            <label htmlFor="attendance-date">Select Date:</label>
            <input
              type="date"
              id="attendance-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}
      </div>

      {/* Attendance Data */}
      <div className="attendance-data">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : attendanceData.length > 0 ? (
          <div className="attendance-table">
            {view === 'date' ? (
              <>
                <div className="table-header">
                  <div className="table-date">
                    Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="table-stats">
                    Present: {attendanceData.filter(a => a.status === 'present').length} |
                    Absent: {attendanceData.filter(a => a.status === 'absent').length}
                  </div>
                </div>
                <div className="attendance-list">
                  {attendanceData.map((record, index) => (
                    <div key={index} className={`attendance-item status-${record.status}`}>
                      <div className="student-info">
                        <div className="student-id">{record.studentId}</div>
                        <div className={`status-badge status-${record.status}`}>
                          {record.status === 'present' ? '✓ Present' : '✗ Absent'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="summary-view">
                <div className="summary-stats">
                  <div className="summary-stat">
                    <div className="stat-number">
                      {attendanceData.filter(a => a.status === 'present').length}
                    </div>
                    <div className="stat-label">Total Present Records</div>
                  </div>
                  <div className="summary-stat">
                    <div className="stat-number">
                      {attendanceData.filter(a => a.status === 'absent').length}
                    </div>
                    <div className="stat-label">Total Absent Records</div>
                  </div>
                  <div className="summary-stat">
                    <div className="stat-number">{attendanceData.length}</div>
                    <div className="stat-label">Total Records</div>
                  </div>
                </div>
                <div className="summary-list">
                  <h4>Recent Records</h4>
                  {attendanceData.slice(0, 20).map((record, index) => (
                    <div key={index} className={`summary-item status-${record.status}`}>
                      <div className="summary-date">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="summary-student">{record.studentId}</div>
                      <div className={`summary-status status-${record.status}`}>
                        {record.status === 'present' ? '✓' : '✗'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="no-data">
            {view === 'date'
              ? 'No attendance records for this date.'
              : 'No attendance records found.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceOverview;
