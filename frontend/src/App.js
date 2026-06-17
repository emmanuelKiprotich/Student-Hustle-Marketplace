// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 🔴 IMPORT ALL YOUR NEW WORKSPACES FROM THE COMPONENTS FOLDER HERE:
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
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/bookings/notifications/vendor', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) setNotifications(resData.data);
    } catch (err) {
      console.error('Failed to sync system notifications.', err);
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
    setUser(null); // 🔴 Reset the user state back to null on logout
    window.location.href = '/';
};

  const pendingCount = notifications.filter(n => n.status === 'pending').length;

  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI, sans-serif', margin: '0 auto', maxWidth: '1200px', padding: '20px', color: '#333' }}>
        
        {/* Unified Application Header Bar Layout */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0288d1', paddingBottom: '15px', marginBottom: '25px', position: 'relative' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: 0, color: '#0288d1' }}>🏫 Campus Side-Hustle Hub</h2>
          </Link>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/marketplace" style={{ textDecoration: 'none', color: '#555', fontWeight: 'bold' }}>Marketplace</Link>
            {token && <Link to="/dashboard" style={{ textDecoration: 'none', color: '#555', fontWeight: 'bold' }}>My Dashboard</Link>}
            {token && <Link to="/messages" style={{ textDecoration: 'none', color: '#555', fontWeight: 'bold' }}>Messages</Link>}
            
            {token && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'none', border: 'none', fontSize: '1.4em', cursor: 'pointer', position: 'relative', padding: '5px' }}>
                  🔔 {pendingCount > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#e53935', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.6em', fontWeight: 'bold' }}>{pendingCount}</span>}
                </button>

                {showDropdown && (
                  <div style={{ position: 'absolute', top: '35px', right: 0, width: '320px', background: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 500, maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#0288d1' }}>Fulfillment Alerts</div>
                    {notifications.length === 0 ? <p style={{ padding: '15px', margin: 0, color: '#777', fontSize: '0.9em', textAlign: 'center' }}>No active alerts found.</p> : 
                      notifications.map((notif) => (
                        <div key={notif.booking_id} style={{ padding: '12px', borderBottom: '1px solid #f5f5f5', backgroundColor: notif.status === 'pending' ? '#f1f8ff' : '#fff', fontSize: '0.88em' }}>
                          <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>👤 {notif.buyer_name} requested your service</p>
                          <p style={{ margin: '0 0 4px 0', color: '#555' }}><strong>Offer:</strong> {notif.listing_title}</p>
                          <span style={{ fontSize: '0.75em', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', textTransform: 'uppercase', background: notif.status === 'pending' ? '#ffe0b2' : '#c8e6c9', color: notif.status === 'pending' ? '#f57c00' : '#388e3c' }}>{notif.status}</span>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            )}

            {!token ? (
              <Link to="/register" style={{ textDecoration: 'none', background: '#0288d1', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold' }}>Verify & Register</Link>
            ) : (
              <button onClick={handleLogout} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
            )}

           {user && user.is_admin && (
              <Link to="/admin" style={{ textDecoration: 'none', color: '#b71c1c', fontWeight: 'bold' }}>
    🛡️ Admin Panel
  </Link>
          )}
          </nav>
        </header>

        {/* 🗺️ TARGET APPARATUS DEPLOYMENT ROUTE GRID */}
        <main>
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