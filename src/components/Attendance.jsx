import React, { useState, useEffect } from 'react';
import { markAttendance, getStudentAttendance, getStudentAttendanceStats } from '../services/api';
import Button from './Button';
import '../styles/Attendance.css';

const Attendance = ({ user, currentClass }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.id && currentClass) {
      fetchAttendanceData();
    }
  }, [user, currentClass]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const [recordsData, statsData] = await Promise.all([
        getStudentAttendance(user.id, currentClass.id),
        getStudentAttendanceStats(user.id, currentClass.id),
      ]);
      setAttendanceRecords(recordsData.attendance || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (status) => {
    setLoading(true);
    try {
      await markAttendance(user.id, currentClass.id, selectedDate, status);
      setMessage(`Marked ${status} for ${selectedDate}`);
      await fetchAttendanceData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !currentClass) {
    return <div>Please select a class to view attendance.</div>;
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>Mark Attendance</h2>
        <p className="attendance-class-name">{currentClass.title}</p>
      </div>

      {/* Attendance Statistics */}
      {stats && (
        <div className="attendance-stats">
          <div className="stat">
            <div className="stat-value">{stats.present}</div>
            <div className="stat-label">Present</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.absent}</div>
            <div className="stat-label">Absent</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat">
            <div className="stat-value">{stats.percentage}%</div>
            <div className="stat-label">Attendance %</div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && <div className="attendance-message">{message}</div>}

      {/* Date Selection and Mark Buttons */}
      <div className="attendance-form">
        <div className="form-group">
          <label htmlFor="attendance-date">Select Date:</label>
          <input
            type="date"
            id="attendance-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="attendance-buttons">
          <Button
            onClick={() => handleMarkAttendance('present')}
            disabled={loading}
            style={{ backgroundColor: '#27ae60' }}
          >
            ✓ Mark Present
          </Button>
          <Button
            onClick={() => handleMarkAttendance('absent')}
            disabled={loading}
            style={{ backgroundColor: '#e74c3c' }}
          >
            ✗ Mark Absent
          </Button>
        </div>
      </div>

      {/* Attendance History */}
      <div className="attendance-history">
        <h3>Attendance History</h3>
        {attendanceRecords.length > 0 ? (
          <div className="attendance-list">
            {attendanceRecords.map((record, index) => (
              <div key={index} className={`attendance-record attendance-${record.status}`}>
                <div className="record-date">
                  {new Date(record.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className={`record-status status-${record.status}`}>
                  {record.status === 'present' ? '✓ Present' : '✗ Absent'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-records">No attendance records yet.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
