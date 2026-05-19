import React, { useState } from 'react';
import Button from '../components/Button';
import { ALL_CLASSES } from '../store';
import { unenrollFromClass } from '../services/api';
import '../styles/pages.css';

const DetailModal = ({ cls, onClose, onDrop }) => (
  <div className="class-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="class-modal">
      <img src={cls.image} alt={cls.title} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 20 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: cls.color }}></div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{cls.subject}</span>
      </div>
      <h2>{cls.title}</h2>
      <div className="class-modal-sub">Taught by {cls.teacher}</div>
      <div className="modal-info-row">
        <div className="modal-info-item"><span>Schedule</span><strong>{cls.schedule}</strong></div>
        <div className="modal-info-item"><span>Room</span><strong>{cls.room}</strong></div>
        <div className="modal-info-item"><span>Capacity</span><strong>{cls.seats} seats</strong></div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>{cls.description}</p>
      <div className="modal-actions">
        <Button variant="danger" size="sm" onClick={() => { onDrop(cls.id); onClose(); }}>Drop Class</Button>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  </div>
);

const MyClasses = ({ user, onNavigate, onRefresh }) => {
  const [selected, setSelected] = useState(null);
  const enrolled = ALL_CLASSES.filter(c => user.enrolledClassIds.includes(c.id));

  const handleDrop = async (classId) => {
    try {
      await unenrollFromClass(user.id, classId);
      await onRefresh();
      setSelected(null);
    } catch (error) {
      console.error('Unable to drop class:', error);
    }
  };

  if (enrolled.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="classes-header">
            <h1>My Classes</h1>
          </div>
          <div className="empty-state-card">
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80" alt="Empty desk" className="empty-state-img" />
            <div className="empty-state-body">
              <h3>You are not enrolled in any classes</h3>
              <p>Head to the course catalogue to find and enroll in classes.</p>
              <Button onClick={() => onNavigate('enroll')}>Browse Courses</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="classes-header">
          <div>
            <h1>My Classes</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
              {enrolled.length} enrolled &middot; Spring 2026
            </p>
          </div>
          <Button onClick={() => onNavigate('enroll')}>+ Enroll in More</Button>
        </div>

        <div className="classes-grid">
          {enrolled.map(cls => (
            <div className="class-card" key={cls.id} onClick={() => setSelected(cls)}>
              <img src={cls.image} alt={cls.title} className="class-card-img" />
              <div className="class-card-body">
                <div className="class-card-subject">{cls.subject}</div>
                <div className="class-card-title">{cls.title}</div>
                <div className="class-card-teacher">{cls.teacher}</div>
                <div className="class-card-meta">
                  <span className="badge badge-green">Enrolled</span>
                </div>
              </div>
              <div className="class-card-footer">
                <div className="class-schedule">{cls.schedule.split('—')[0].trim()}</div>
                <Button variant="ghost" size="sm">Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <DetailModal cls={selected} onClose={() => setSelected(null)} onDrop={handleDrop} />}
    </div>
  );
};

export default MyClasses;