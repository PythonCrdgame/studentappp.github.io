import React, { useState, useRef } from 'react';
import Button from '../components/Button';
import { updateUserAvatar, ALL_CLASSES } from '../store';
import '../styles/pages.css';
import '../styles/Profile.css';

const DEFAULT_PFP = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&q=80';

const Profile = ({ user, onRefresh, onNavigate }) => {
  const [dragging, setDragging]   = useState(false);
  const [preview, setPreview]     = useState(user.avatar || null);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState('');
  const fileRef = useRef();

  const enrolled = ALL_CLASSES.filter(c => user.enrolledClassIds.includes(c.id));

  const processFile = (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, GIF, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSave = () => {
    updateUserAvatar(user.id, preview);
    onRefresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRemove = () => {
    setPreview(null);
    updateUserAvatar(user.id, null);
    onRefresh();
    setSaved(false);
  };

  const avatarSrc = preview || DEFAULT_PFP;
  const hasCustom  = !!preview;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 760 }}>

        <div style={{ marginBottom: 32 }}>
          <h1 className="profile-page-title">Your Profile</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>
            Manage your account details and profile picture.
          </p>
        </div>

        <div className="profile-layout">

          {/* ── Avatar card ── */}
          <div className="profile-avatar-card">
            <div className="profile-avatar-wrap">
              <img src={avatarSrc} alt="Profile" className="profile-avatar-img" />
              <button
                className="profile-avatar-edit-btn"
                onClick={() => fileRef.current.click()}
                title="Change photo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>

            <div className="profile-avatar-name">{user.name}</div>
            <span className={`nav-role-badge ${user.role}`} style={{ alignSelf: 'center', marginBottom: 8 }}>
              {user.role}
            </span>
            <div className="profile-avatar-email">{user.email}</div>

            {/* Drop zone */}
            <div
              className={`profile-drop-zone${dragging ? ' dragging' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', marginBottom: 6 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Drop an image here or <strong>click to browse</strong></span>
              <span className="profile-drop-hint">JPG, PNG, GIF, WebP &mdash; max 5 MB</span>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {error && <div className="auth-error" style={{ marginTop: 8 }}>{error}</div>}

            <div className="profile-avatar-actions">
              {hasCustom && (
                <Button variant="danger" size="sm" onClick={handleRemove}>Remove Photo</Button>
              )}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!preview || preview === user.avatar}
              >
                {saved ? 'Saved!' : 'Save Photo'}
              </Button>
            </div>
          </div>

          {/* ── Info card ── */}
          <div className="profile-info-card">
            <div className="profile-section-label">Account Details</div>

            <div className="profile-field">
              <div className="profile-field-label">Full Name</div>
              <div className="profile-field-value">{user.name}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Email Address</div>
              <div className="profile-field-value">{user.email}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Role</div>
              <div className="profile-field-value" style={{ textTransform: 'capitalize' }}>{user.role}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Member Since</div>
              <div className="profile-field-value">Spring 2026</div>
            </div>

            {user.role === 'student' && (
              <>
                <div className="profile-section-label" style={{ marginTop: 24 }}>Enrolled Classes</div>
                {enrolled.length === 0 ? (
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', padding: '12px 0' }}>
                    No classes enrolled yet.{' '}
                    <span
                      style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => onNavigate('enroll')}
                    >
                      Browse courses
                    </span>
                  </div>
                ) : (
                  <div className="profile-enrolled-list">
                    {enrolled.map(cls => (
                      <div className="profile-enrolled-item" key={cls.id}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: cls.color, flexShrink: 0 }}></div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{cls.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cls.subject} &middot; {cls.teacher}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;