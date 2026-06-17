// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Component imports...
import LandingPage from './components/LandingPage';
import MarketplaceHome from './components/MarketplaceHome';
import Register from './components/Register';
import BookingPanel from './components/BookingPanel';
import StudentDashboard from './components/StudentDashboard';
import ServiceDetails from './components/ServiceDetails';
import MessagingInterface from './components/MessagingInterface';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔴 1. INITIALIZE DARK MODE STATE PREFERENCE MATRIX
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // 🔴 2. ENFORCE THE DOM CLASS MUTATION LISTENER EFFECT
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/bookings/notifications/vendor', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) setNotifications(resData.data);
    } catch (err) {
      console.error('Failed to sync system notification arrays.', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser(null);
    window.location.href = '/';
  };

  const pendingCount = notifications.filter(n => n.status === 'pending').length;

  return (
    <Router>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '30px', position: 'relative' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏫 Campus Side-Hustle Hub
            </h2>
          </Link>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/marketplace" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.95rem' }}>Marketplace</Link>
            {token && <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.95rem' }}>My Dashboard</Link>}
            {token && <Link to="/messages" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '600', fontSize: '0.95rem' }}>Messages</Link>}
            
            {user && user.is_admin && (
              <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--danger)', fontWeight: '700', fontSize: '0.95rem' }}>🛡️ Admin Panel</Link>
            )}

            {/* 🔴 3. INTERACTIVE THEME TOGGLE ELEMENT ACCENT CONTROL */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '4px', outline: 'none' }}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {token && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'none', padding: '6px', fontSize: '1.3rem', position: 'relative', outline: 'none' }}>
                  🔔 {pendingCount > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--danger)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.65rem', fontWeight: 'bold' }}>{pendingCount}</span>}
                </button>

                {showDropdown && (
                  <div style={{ position: 'absolute', top: '45px', right: 0, width: '340px', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 1000, maxHeight: '420px', overflowY: 'auto' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem' }}>Fulfillment Alerts Queue</div>
                    {notifications.length === 0 ? <p style={{ padding: '20px', margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No execution metrics found.</p> : 
                      notifications.map((notif) => (
                        <div key={notif.booking_id} style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: notif.status === 'pending' ? '#f8fafc' : '#fff', fontSize: '0.88rem' }}>
                          <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#0f172a' }}>👤 {notif.buyer_name} requested your service</p>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--text-muted)' }}><strong>Offer:</strong> {notif.listing_title}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', background: notif.status === 'pending' ? '#fef3c7' : 'var(--success-light)', color: notif.status === 'pending' ? '#d97706' : 'var(--success)' }}>{notif.status}</span>
                            {notif.status === 'pending' && (
                              <button
                                onClick={async () => {
                                  if (!window.confirm('Mark this peer task portfolio item as fully completed?')) return;
                                  try {
                                    const response = await fetch(`http://localhost:5000/api/bookings/${notif.booking_id}/complete`, {
                                      method: 'PATCH',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    const data = await response.json();
                                    if (data.success) {
                                      setNotifications(prevNotifs => prevNotifs.filter(item => item.booking_id !== notif.booking_id));
                                      fetchAlerts();
                                    } else { alert(data.message); }
                                  } catch (err) { console.error('Failed to communicate task fulfillment patches:', err); }
                                }}
                                style={{ background: 'var(--success)', color: 'white', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600' }}
                              >Mark as Complete ✓</button>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            )}

            {!token ? (
              <Link to="/register" className="btn" style={{ textDecoration: 'none', background: 'var(--primary)', color: 'white', padding: '10px 20px', fontSize: '0.9rem' }}>Verify & Register</Link>
            ) : (
              <button onClick={handleLogout} style={{ background: 'var(--danger)', color: 'white', padding: '10px 20px', fontSize: '0.9rem' }}>Logout</button>
            )}
          </nav>
        </header>

        <main style={{ paddingBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplaceHome token={token} />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
            <Route path="/dashboard" element={<StudentDashboard token={token} />} />
            <Route path="/service/:listingId" element={<ServiceDetails token={token} />} />
            <Route path="/booking/:listingId" element={<BookingPanel token={token} />} />
            <Route path="/messages" element={<MessagingInterface />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;