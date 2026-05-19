import React, { useState } from 'react';
import Button from '../components/Button';
import { ALL_CLASSES } from '../store';
import { enrollInClass, unenrollFromClass } from '../services/api';
import '../styles/pages.css';

const SUBJECTS = ['All', ...Array.from(new Set(ALL_CLASSES.map(c => c.subject)))];

const Enroll = ({ user, onNavigate, onRefresh }) => {
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [preview, setPreview] = useState(null);
  const [justEnrolled, setJustEnrolled] = useState(null);

  const isEnrolled = (id) => user.enrolledClassIds.includes(id);

  const handleEnroll = async (classId) => {
    try {
      await enrollInClass(user.id, classId);
      setJustEnrolled(classId);
      await onRefresh();
      setTimeout(() => setJustEnrolled(null), 2000);
    } catch (error) {
      console.error('Unable to enroll:', error);
    }
  };

  const handleDrop = async (classId) => {
    try {
      await unenrollFromClass(user.id, classId);
      await onRefresh();
    } catch (error) {
      console.error('Unable to drop class:', error);
    }
  };

  const visible = ALL_CLASSES.filter(c => {
    const matchSubject = filter === 'All' || c.subject === filter;
    const matchSearch  = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>Course Catalogue</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>
            Spring 2026 &mdash; {ALL_CLASSES.length} courses available
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="enroll-toolbar">
          <input
            className="form-input enroll-search"
            placeholder="Search by course or instructor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="enroll-filters">
            {SUBJECTS.map(s => (
              <button
                key={s}
                className={`filter-chip${filter === s ? ' active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="classes-grid" style={{ marginTop: 24 }}>
          {visible.map(cls => {
            const enrolled = isEnrolled(cls.id);
            const success  = justEnrolled === cls.id;
            return (
              <div className="class-card" key={cls.id}>
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="class-card-img"
                  onClick={() => setPreview(cls)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="class-card-body" onClick={() => setPreview(cls)} style={{ cursor: 'pointer' }}>
                  <div className="class-card-subject">{cls.subject}</div>
                  <div className="class-card-title">{cls.title}</div>
                  <div className="class-card-teacher">{cls.teacher}</div>
                  <div className="class-card-meta">
                    <span className={`badge ${enrolled ? 'badge-green' : 'badge-blue'}`}>
                      {enrolled ? 'Enrolled' : `${cls.seats} seats`}
                    </span>
                  </div>
                </div>
                <div className="class-card-footer">
                  <div className="class-schedule">{cls.schedule.split('—')[0].trim()}</div>
                  {enrolled ? (
                    <Button variant="secondary" size="sm" onClick={() => handleDrop(cls.id)}>Drop</Button>
                  ) : (
                    <Button size="sm" onClick={() => handleEnroll(cls.id)}>
                      {success ? 'Enrolled!' : 'Enroll'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&q=80"
              alt="No results" style={{ width: 160, borderRadius: 12, marginBottom: 16, opacity: 0.7 }} />
            <p>No courses match your search.</p>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="class-modal-overlay" onClick={e => e.target === e.currentTarget && setPreview(null)}>
          <div className="class-modal">
            <img src={preview.image} alt={preview.title}
              style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 20 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: preview.color }}></div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{preview.subject}</span>
            </div>
            <h2>{preview.title}</h2>
            <div className="class-modal-sub">Taught by {preview.teacher}</div>
            <div className="modal-info-row">
              <div className="modal-info-item"><span>Schedule</span><strong>{preview.schedule}</strong></div>
              <div className="modal-info-item"><span>Room</span><strong>{preview.room}</strong></div>
              <div className="modal-info-item"><span>Seats</span><strong>{preview.seats}</strong></div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>{preview.description}</p>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setPreview(null)}>Close</Button>
              {isEnrolled(preview.id) ? (
                <Button variant="danger" onClick={() => { handleDrop(preview.id); setPreview(null); }}>Drop Class</Button>
              ) : (
                <Button onClick={() => { handleEnroll(preview.id); setPreview(null); }}>Enroll Now</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enroll;