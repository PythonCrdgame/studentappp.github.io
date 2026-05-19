import React, { useState, useRef, useEffect } from 'react';
import '../styles/Navbar.css';
import Button from './Button';

const DEFAULT_PFP = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&q=80';

const STUDENT_LINKS = [
  { label: 'Home',       page: 'home' },
  { label: 'My Classes', page: 'classes' },
  { label: 'Enroll',     page: 'enroll' },
  { label: 'Attendance', page: 'attendance' },
  { label: 'Contact',    page: 'contact' },
];

const TEACHER_LINKS = [
  { label: 'Dashboard', page: 'teacher' },
];

const Navbar = ({ currentPage, onNavigate, user, onLogout }) => {
  const links = user?.role === 'teacher' ? TEACHER_LINKS : STUDENT_LINKS;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatarSrc = user?.avatar || DEFAULT_PFP;

  return (
    <nav className="navbar">
      <div className="container">
        <div
          className="navbar-brand"
          onClick={() => onNavigate(user?.role === 'teacher' ? 'teacher' : 'home')}
          style={{ cursor: 'pointer' }}
        >
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=64&q=80"
            alt="StudentApp"
            className="navbar-brand-img"
          />
          StudentApp
        </div>

        <ul className="navbar-links">
          {links.map(link => (
            <li key={link.page}>
              <a
                href="#"
                className={currentPage === link.page ? 'active' : ''}
                onClick={e => { e.preventDefault(); onNavigate(link.page); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          {user && (
            <div className="nav-profile-cluster" ref={dropdownRef}>
              <button
                className="nav-avatar-btn"
                onClick={() => setDropdownOpen(o => !o)}
                aria-label="Open profile menu"
              >
                <img src={avatarSrc} alt={user.name} className="nav-avatar-img" />
                <div className="nav-user-info">
                  <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                  <span className={`nav-role-badge ${user.role}`}>{user.role}</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'var(--text-muted)', flexShrink: 0, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <img src={avatarSrc} alt={user.name} className="nav-dropdown-avatar" />
                    <div>
                      <div className="nav-dropdown-name">{user.name}</div>
                      <div className="nav-dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="nav-dropdown-divider" />
                  <button
                    className="nav-dropdown-item"
                    onClick={() => { setDropdownOpen(false); onNavigate('profile'); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    View Profile
                  </button>
                  <button
                    className="nav-dropdown-item"
                    onClick={() => { setDropdownOpen(false); onNavigate('profile'); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Change Photo
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button
                    className="nav-dropdown-item nav-dropdown-item-danger"
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;