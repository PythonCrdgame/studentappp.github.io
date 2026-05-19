import React from 'react';
import Button from '../components/Button';
import { ALL_CLASSES } from '../store';
import '../styles/pages.css';

const HOUR = new Date().getHours();
const GREETING = HOUR < 12 ? 'Good morning' : HOUR < 17 ? 'Good afternoon' : 'Good evening';

const Home = ({ user, onNavigate }) => {
  const firstName = user.name.split(' ')[0];
  const enrolled = ALL_CLASSES.filter(c => user.enrolledClassIds.includes(c.id));
  const hasClasses = enrolled.length > 0;

  // Compute pending from enrolled classes (simulate: 30% chance each class has something due)
  const pendingCount = enrolled.filter((_, i) => i % 3 === 0).length;

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Hero */}
        <div className="home-hero">
          <span className="home-hero-greeting">{GREETING}</span>
          <h1>Welcome back, {firstName}.</h1>
          <p>{hasClasses
            ? 'Here is what is happening with your courses today.'
            : 'Get started by browsing and enrolling in your first class.'}
          </p>
          <div className="home-hero-actions">
            {hasClasses
              ? <Button onClick={() => onNavigate('classes')}>View My Classes</Button>
              : <Button onClick={() => onNavigate('enroll')}>Browse Courses</Button>
            }
            <Button variant="secondary" onClick={() => onNavigate('contact')}>Contact Support</Button>
          </div>
        </div>

        {/* Stats — only if enrolled */}
        {hasClasses && (
          <div className="stats-row">
            {[
              { img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=80&q=80', value: enrolled.length, label: 'Active Classes' },
              { img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=80&q=80', value: pendingCount, label: 'Assignments Due' },
              { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&q=80', value: 'B+', label: 'Avg. Grade' },
              { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', value: '92%', label: 'Attendance' },
            ].map(s => (
              <div className="stat-card" key={s.label}>
                <img src={s.img} alt={s.label} className="stat-card-img" />
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Content grid */}
        {hasClasses ? (
          <div className="home-grid">
            {/* Activity */}
            <div>
              <div className="section-title">Recent Activity</div>
              <div className="recent-activity">
                {user.activity.length === 0 ? (
                  <div className="empty-state-inline">No activity yet.</div>
                ) : user.activity.slice(0, 6).map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-dot activity-dot-green"></div>
                    <div className="activity-info">
                      <div className="activity-title">Enrolled in {a.className}</div>
                      <div className="activity-sub">{new Date(a.ts).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrolled class thumbnails */}
            <div>
              <div className="section-title">Your Classes</div>
              <div className="recent-activity">
                {enrolled.map(cls => (
                  <div className="activity-item" key={cls.id} style={{ gap: 14 }}>
                    <img src={cls.image} alt={cls.title}
                      style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    <div className="activity-info">
                      <div className="activity-title">{cls.title}</div>
                      <div className="activity-sub">{cls.teacher}</div>
                    </div>
                    <span className="badge badge-green">Enrolled</span>
                  </div>
                ))}
                <div style={{ padding: '14px 20px' }}>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('enroll')}>
                    Browse more courses
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="empty-state-card">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80"
              alt="Empty library"
              className="empty-state-img"
            />
            <div className="empty-state-body">
              <h3>No classes yet</h3>
              <p>Browse the course catalogue and enroll in your first class to get started.</p>
              <Button onClick={() => onNavigate('enroll')}>Browse Course Catalogue</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;