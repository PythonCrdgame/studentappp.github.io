import React, { useState } from 'react';
import Button from '../components/Button';
import '../styles/pages.css';

const METHODS = [
  { img: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=120&q=80', title: 'Email', value: 'support@studentapp.edu' },
  { img: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=120&q=80', title: 'Phone', value: '+1 (416) 555-0192' },
  { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&q=80', title: 'Campus Office', value: 'Room 204, Admin Building' },
  { img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=120&q=80', title: 'Office Hours', value: 'Mon – Fri, 8 AM – 5 PM' },
];

const Contact = () => {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); setForm({ name: '', email: '', subject: '', message: '' }); }, 1000);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="contact-layout">
          <div className="contact-info">
            <h1>Get in touch</h1>
            <p>Have a question about your classes, grades, or account? We are here to help and will respond within one business day.</p>
            <div className="contact-methods">
              {METHODS.map(m => (
                <div className="contact-method" key={m.title}>
                  <img src={m.img} alt={m.title} className="contact-method-icon" style={{ borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <div className="contact-method-title">{m.title}</div>
                    <div className="contact-method-value">{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-card">
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>Send a message</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Typical response time is under 24 hours.</p>
            </div>

            {sent ? (
              <div className="form-success">
                <img src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=80&q=80"
                  alt="Sent" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                <div>
                  <strong>Message sent!</strong>
                  <div style={{ fontSize: 13, marginTop: 2 }}>We will get back to you shortly.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" name="name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" name="email" type="email" placeholder="jane@school.edu" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select className="form-input" name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">Select a topic...</option>
                    <option>Class enrollment</option>
                    <option>Grade dispute</option>
                    <option>Technical issue</option>
                    <option>Account help</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" name="message" placeholder="Describe your question..." value={form.message} onChange={handleChange} required />
                </div>
                <Button type="submit" full disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;