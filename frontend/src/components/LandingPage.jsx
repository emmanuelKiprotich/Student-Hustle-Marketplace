// components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
      <div style={{ background: '#fff', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
        {/* Hero Segment */}
        <section style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(135deg, #e1f5fe 0%, #ffffff 100%)', borderRadius: '16px', marginBottom: '50px' }}>
          <span style={{ background: '#0288d1', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Exclusively for Strathmore University Students
          </span>
          <h1 style={{ fontSize: '3.2em', color: '#111', margin: '20px 0 15px 0', fontWeight: '800', lineHeight: '1.2' }}>
            Turn Your Campus Talents <br /><span style={{ color: '#0288d1' }}>Into Sustainable Income</span>
          </h1>
          <p style={{ fontSize: '1.2em', color: '#555', maxWidth: '650px', margin: '0 auto 35px auto', lineHeight: '1.6' }}>
            The trusted, institutionally verified peer-to-peer marketplace. Buy homemade food, book laptop repairs, or hire graphic designers—all within your hostel radius.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/register" style={{ textDecoration: 'none', background: '#0288d1', color: 'white', padding: '14px 32px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.05em', boxShadow: '0 4px 12px rgba(2,136,209,0.3)' }}>
              Get Started Now
            </Link>
            <a href="#discovery" style={{ textDecoration: 'none', background: '#fff', color: '#333', padding: '14px 32px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.05em', border: '1px solid #ccc' }}>
              Browse Marketplace
            </a>
          </div>
        </section>

        {/* Structural Pillars Segment */}
        <section id="discovery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', padding: '20px 0' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '2.5em', marginBottom: '15px' }}>🔒</div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.3em', color: '#111' }}>Verified Accountability</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '0.95em', lineHeight: '1.5' }}>
              Zero public access. Mandatory institutional email validation ensures every buyer and vendor is an active student peer on campus.
            </p>
          </div>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '2.5em', marginBottom: '15px' }}>⚡</div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.3em', color: '#111' }}>Hyperlocal Discovery</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '0.95em', lineHeight: '1.5' }}>
              Bypass global delivery delays. Find high-quality freelance work from peers located just two hostels or lecture rooms away[cite: 1].
            </p>
          </div>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '2.5em', marginBottom: '15px' }}>📈</div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.3em', color: '#111' }}>Zero Platform Fees</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '0.95em', lineHeight: '1.5' }}>
              Keep 100% of your earnings. We charge absolute zero commission cuts, unlike corporate global marketplace alternatives[cite: 1].
            </p>
          </div>
        </section>
      </div>
    );
};

export default LandingPage;