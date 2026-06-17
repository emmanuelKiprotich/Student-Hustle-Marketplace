// frontend/src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';

const StudentDashboard = ({ token }) => {
    const [listings, setListings] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [summary, setSummary] = useState({ totalRequests: 0, totalEarnings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Safely extract the profile context logged during your 2FA registration challenge
    const currentUser = JSON.parse(localStorage.getItem('user')) || { name: 'Student Peer', email: 'N/A' };

    const loadDashboardMetrics = async () => {
        if (!token) {
            setError('Please verify security credentials via login access.');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/listings/dashboard/metrics', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                setListings(data.listings);
                setActiveOrders(data.activeOrders);
                setSummary(data.summary);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Unable to link layout variables with analytics server engine.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardMetrics();
    }, [token]);

    if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Retrieving dynamic user profile summaries...</p>;
    if (error) return <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: '#fef2f2', color: 'var(--danger)', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px' }}>
            
            {/* Identity Profile Greeting Card */}
            <div style={{ background: 'var(--primary)', color: 'white', padding: '30px', borderRadius: 'var(--radius-md)', marginBottom: '30px', boxShadow: 'var(--shadow-md)' }}>
                <h2 style={{ margin: 0, color: 'white' }}>Habari, {currentUser.name}! 👋</h2>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
                    Signed in under profile matrix: <strong>{currentUser.email}</strong>
                </p>
            </div>

            {/* Live Analytics Dashboard Block Matrices */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Your Registered Offers</span>
                    <h3 style={{ margin: '10px 0 0 0', fontSize: '2.2rem' }}>{listings.length}</h3>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Incoming Booking Volume</span>
                    <h3 style={{ margin: '10px 0 0 0', fontSize: '2.2rem', color: 'var(--primary)' }}>{summary.totalRequests}</h3>
                </div>
                <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--success)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Capital Generated (Settled)</span>
                    <h3 style={{ margin: '10px 0 0 0', fontSize: '2.2rem', color: 'var(--success)' }}>
                        KSh {summary.totalEarnings.toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Management Splitting Layout Panel View */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* Left Side: Your Personal Active Catalog Items */}
                <div>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Your Live Listings Portal</h3>
                    {listings.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>You haven't listed any services under this profile yet.</p>
                    ) : (
                        listings.map(item => (
                            <div key={item.id} className="card" style={{ marginBottom: '15px', padding: '16px 20px' }}>
                                <h5 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a' }}>{item.title}</h5>
                                <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '1rem' }}>
                                    KSh {parseFloat(item.price).toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Right Side: Pending Actionable Micro-Tasks Flow */}
                <div>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Outstanding Fulfillment Work</h3>
                    {activeOrders.length === 0 ? (
                        <div style={{ padding: '30px 20px', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                🎉 All pending peer scheduling orders are fully clear!
                            </p>
                        </div>
                    ) : (
                        activeOrders.map(order => (
                            <div key={order.id} className="card" style={{ marginBottom: '15px', padding: '16px 20px', borderLeft: '4px solid #f57c00' }}>
                                <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>👤 Client: {order.buyer_name}</p>
                                <p style={{ margin: '0 0 6px 0', color: 'var(--text-dark)', fontSize: '0.92rem' }}><strong>Service:</strong> {order.title}</p>
                                <small style={{ color: '#94a3b8' }}>🕒 Needed: {new Date(order.scheduled_date).toLocaleDateString()}</small>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;