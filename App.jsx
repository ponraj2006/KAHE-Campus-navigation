import React from 'react';
import ChatbotWidget from './src/components/chatbot/ChatbotWidget';
import AdminPanel from './src/components/admin/AdminPanel';
import './styles/App.css';

export default function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="kahe-app">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <span>🎓 Admissions Enquiry | NAAC A+ Accredited Grade Institution | Coimbatore</span>
      </div>

      {/* Main Website Header */}
      <header className="site-header">
        <div className="site-brand">
          <div className="brand-crest">✦</div>
          <div>
            <h1>KARPAGAM</h1>
            <p>Academy of Higher Education (Deemed to be University)</p>
          </div>
        </div>
        <nav className="site-nav">
          <a href="#about">About</a>
          <a href="#at-a-glance">At a glance</a>
          <a href="mailto:info@kahedu.edu.in?subject=Admissions%20Enquiry">Admissions</a>
          <a href="mailto:info@kahedu.edu.in?subject=Admissions%20Enquiry" className="nav-cta">Apply Now</a>
        </nav>
      </header>

      {/* Hero Showcase */}
      <main className="hero-banner" id="about">
        <div className="hero-content">
          <span className="badge">Ranked Among Top Universities</span>
          <h2>Empowering Minds, Transforming Futures</h2>
          <p>
            Join Karpagam Academy of Higher Education. Experience world-class 
            multidisciplinary education across Engineering, Architecture, Pharmacy, and Arts & Science.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#at-a-glance">Explore Programs</a>
            <a className="btn-secondary" href="https://www.google.com/maps/search/?api=1&query=Karpagam+Academy+of+Higher+Education" target="_blank" rel="noreferrer">Virtual Campus Tour</a>
          </div>
        </div>
      </main>

      {/* Quick Statistics */}
      <section className="stats-bar" id="at-a-glance">
        <div className="stat-card">
          <h3>45+</h3>
          <p>Accredited Programs</p>
        </div>
        <div className="stat-card">
          <h3>₹24 LPA</h3>
          <p>Highest Placement Package</p>
        </div>
        <div className="stat-card">
          <h3>250+</h3>
          <p>Global Recruiting Partners</p>
        </div>
        <div className="stat-card">
          <h3>NAAC A+</h3>
          <p>Institutional Grade</p>
        </div>
      </section>

      {/* Smart Chatbot Mounted at Root Level */}
      <ChatbotWidget />
    </div>
  );
}