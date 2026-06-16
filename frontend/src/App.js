// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MarketplaceHome from './components/MarketplaceHome';
import Register from './components/Register';
import BookingPanel from './components/BookingPanel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch alerts if the user is authenticated as a local service provider
  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/bookings/notifications/vendor', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await response.json();
      if (resData.success) setNotifications(resData.data);
    } catch (err) {
      console.error('Failed to capture sync notification data vectors.', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Polling mechanism every 10 seconds
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    window.location.href = '/';
  };

  const pendingCount = notifications.filter(n => n.status === 'pending').length;

  return (
    <Router>
      <div style={{ fontFamily: 'Segoe UI, sans-serif', margin: '0 auto', maxWidth: '1200px', padding: '20px', color: '#333' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0288d1', paddingBottom: '15px', position: 'relative' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: 0, color: '#0288d1' }}>🏫 Campus Side-Hustle Hub</h2>
          </Link>
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#555', fontWeight: 'bold' }}>Marketplace</Link>
            
            {token && (
              <div style={{ position: 'relative' }}>
                {/* Interactive Notification Bell Vector Icon */}
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ background: 'none', border: 'none', fontSize: '1.4em', cursor: 'pointer', position: 'relative', padding: '5px' }}
                >
                  🔔
                  {pendingCount > 0 && (
                    <span style={{ position: 'absolute', top: 0, right: 0, background: '#e53935', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.6em', fontWeight: 'bold' }}>
                      {pendingCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Card Matrix */}
                {showDropdown && (
                  <div style={{ position: 'absolute', top: '35px', right: 0, width: '320px', background: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 500, maxHeight: '400px', overflowY: 'auto' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#0288d1', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fulfillment Alerts</span>
                      <span style={{ fontSize: '0.85em', color: '#666' }}>({notifications.length})</span>
                    </div>
                    {notifications.length === 0 ? (
                      <p style={{ padding: '15px', margin: 0, color: '#777', fontSize: '0.9em', textAlign: 'center' }}>No execution metrics found.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.booking_id} style={{ padding: '12px', borderBottom: '1px solid #f5f5f5', backgroundColor: notif.status === 'pending' ? '#f1f8ff' : '#fff', fontSize: '0.88em' }}>
                          <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>👤 {notif.buyer_name} requested your service</p>
                          <p style={{ margin: '0 0 4px 0', color: '#555' }}><strong>Offer:</strong> {notif.listing_title}</p>
                          <p style={{ margin: '0 0 6px 0', color: '#888', fontSize: '0.82em' }}>🕒 {new Date(notif.scheduled_date).toLocaleString()}</p>
                          <span style={{ fontSize: '0.75em', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', textTransform: 'uppercase', background: notif.status === 'pending' ? '#ffe0b2' : '#c8e6c9', color: notif.status === 'pending' ? '#f57c00' : '#388e3c' }}>
                            {notif.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {!token ? (
              <Link to="/register" style={{ textDecoration: 'none', background: '#0288d1', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold' }}>Verify & Register</Link>
            ) : (
              <button onClick={handleLogout} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
            )}
          </nav>
        </header>

        <main style={{ marginTop: '30px' }}>
          <Routes>
            <Route path="/" element={<MarketplaceHome token={token} />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
            <Route path="/booking/:listingId" element={<BookingPanel token={token} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;