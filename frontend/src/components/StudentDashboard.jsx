// components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';

const StudentDashboard = ({ token }) => {
    const [myListings, setMyListings] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const userMetrics = JSON.parse(localStorage.getItem('user')) || { name: 'Student Peer' };

    useEffect(() => {
        if (!token) return;
        // Connect pool queries to display user records during component mount
        fetch('http://localhost:5000/api/listings/search')
            .then(res => res.json())
            .then(data => data.success && setMyListings(data.listings.slice(0, 3)))
            .catch(err => console.error(err));
    }, [token]);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px' }}>
            {/* Header Identity Greeting */}
            <div style={{ background: '#0288d1', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(2,136,209,0.2)' }}>
                <h2 style={{ margin: 0 }}>Habari, {userMetrics.name}! 👋</h2>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Welcome to your workspace. Monitor your campus revenue metrics and active peer bookings.</p>
            </div>

            {/* Micro Analytics Blocks Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85em', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Active Portfolio Items</span>
                    <h3 style={{ margin: '10px 0 0 0', fontSize: '2em', color: '#111' }}>{myListings.length}</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85em', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Fulfillment Requests</span>
                    <h3 style={{ margin: '10px 0 0 0', fontSize: '2em', color: '#2e7d32' }}>4</h3>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85em', color: '#666', textTransform: 'uppercase', fontWeight: 'bold' }}>Estimated Capital Generated</span>
                    <h3 style={{ margin: '10px 0 0 0', fontSize: '2em', color: '#0288d1' }}>KSh 8,500</h3>
                </div>
            </div>

            {/* Split Operational Views: Management Matrices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
                <div>
                    <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Your Live Listings</h3>
                    {myListings.map(item => (
                        <div key={item.id} style={{ background: '#fff', padding: '15px', border: '1px solid #eee', borderRadius: '6px', marginBottom: '15px' }}>
                            <h5 style={{ margin: '0 0 5px 0', fontSize: '1.1em' }}>{item.title}</h5>
                            <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>KSh {item.price}</span>
                        </div>
                    ))}
                </div>
                <div>
                    <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Recent Order Flow Tasks</h3>
                    <div style={{ background: '#fcfdff', padding: '20px', borderRadius: '8px', border: '1px solid #eef1f5', textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#777' }}>All current scheduling threads are active. Use the header notification alert bell to accept incoming task parameters.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;