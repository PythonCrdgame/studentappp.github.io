import React, { useState } from 'react';
import Button from '../components/Button';
import { login, register } from '../services/api';
import '../styles/pages.css';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Enroll in courses and track your progress',
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    desc: 'Manage your classes and view enrolled students',
    img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80',
  },
];

const Auth = ({ onLogin }) => {
  const [tab, setTab]     = useState('login');   // 'login' | 'signup'
  const [role, setRole]   = useState('student'); // 'student' | 'teacher'
  const [step, setStep]   = useState('role');    // 'role' | 'form'  (signup only)
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const reset = () => {
    setForm({ name: '', email: '', password: '', confirm: '' });
    setError('');
    setStep('role');
    setRole('student');
  };

  const switchTab = (t) => { setTab(t); reset(); };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'signup') {
      if (!form.name.trim())  return setError('Full name is required.');
      if (!form.email.trim()) return setError('Email is required.');
      if (!form.password)     return setError('Password is required.');
      if (form.password !== form.confirm) return setError('Passwords do not match.');

      setLoading(true);
      try {
        const result = await register(form.name.trim(), form.email.trim(), form.password, role);
        onLogin(result.user);
      } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }

    } else {
      if (!form.email || !form.password) return setError('Please enter your email and password.');

      setLoading(true);
      try {
        const result = await login(form.email.trim(), form.password);
        onLogin(result.user);
      } catch (err) {
        setError(err.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=64&q=80"
            alt="StudentApp"
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }}
          />
          StudentApp
        </div>

        {/* Login / Signup tabs */}
        <div className="auth-tabs">
          <div className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</div>
          <div className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>Sign Up</div>
        </div>

        {/* ── SIGN IN ─────────────────────────────── */}
        {tab === 'login' && (
          <>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-sub">Sign in with your registered email and password.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" name="email" type="email" placeholder="you@school.edu"
                  value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" name="password" type="password" placeholder="••••••••"
                  value={form.password} onChange={handleChange} autoComplete="current-password" />
              </div>
              {error && <div className="auth-error">{error}</div>}
              <Button type="submit" full disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</Button>
            </form>
            <div className="auth-hint">
              <strong>Demo — Student:</strong> student@school.edu / password123<br />
              <strong>Demo — Teacher:</strong> teacher@school.edu / teach2026
            </div>
          </>
        )}

        {/* ── SIGN UP ─────────────────────────────── */}
        {tab === 'signup' && (
          <>
            {step === 'role' && (
              <>
                <h2 className="auth-title">Who are you?</h2>
                <p className="auth-sub">Select your role to get started.</p>
                <div className="role-cards">
                  {ROLES.map(r => (
                    <div
                      key={r.id}
                      className={`role-card${role === r.id ? ' selected' : ''}`}
                      onClick={() => setRole(r.id)}
                    >
                      <img src={r.img} alt={r.label} className="role-card-img" />
                      <div className="role-card-body">
                        <div className="role-card-label">{r.label}</div>
                        <div className="role-card-desc">{r.desc}</div>
                      </div>
                      <div className="role-card-check">role === r.id ? 'OK' : ''</div>
                    </div>
                  ))}
                </div>
                <Button full onClick={() => setStep('form')} style={{ marginTop: 8 }}>
                  Continue as {ROLES.find(r => r.id === role).label}
                </Button>
              </>
            )}

            {step === 'form' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <button className="back-btn" onClick={() => { setStep('role'); setError(''); }}>← Back</button>
                  <span className="auth-role-badge">{role === 'teacher' ? 'Teacher' : 'Student'} account</span>
                </div>
                <h2 className="auth-title">Create your account</h2>
                <p className="auth-sub">Fill in your details below.</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" name="name" placeholder="Jane Smith"
                      value={form.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" name="email" type="email" placeholder="you@school.edu"
                      value={form.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" name="password" type="password" placeholder="Min. 6 characters"
                      value={form.password} onChange={handleChange} autoComplete="new-password" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input className="form-input" name="confirm" type="password" placeholder="Repeat password"
                      value={form.confirm} onChange={handleChange} autoComplete="new-password" />
                  </div>
                  {error && <div className="auth-error">{error}</div>}
                  <Button type="submit" full disabled={loading}>{loading ? 'Creating account…' : 'Create Account'}</Button>
                </form>
              </>
            )}
          </>
        )}

        <div className="auth-footer">
          {tab === 'login'
            ? <span>No account? <a onClick={() => switchTab('signup')}>Sign up</a></span>
            : <span>Already registered? <a onClick={() => switchTab('login')}>Sign in</a></span>
          }
        </div>
      </div>
    </div>
  );
};

export default Auth;