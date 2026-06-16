// components/BookingPanel.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSystem from './ReviewSystem';

const BookingPanel = ({ token }) => {
    const { listingId } = useParams();
    const [item, setItem] = useState(null);
    const [scheduledDate, setScheduledDate] = useState('');
    const [runtimeStatus, setRuntimeStatus] = useState('');
    const [activeBookingId, setActiveBookingId] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/listings/${listingId}`)
            .then(res => res.json())
            .then(data => data.success && setItem(data.listing))
            .catch(err => console.error('Error fetching entry:', err));
    }, [listingId]);

    const handleProcessScheduling = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ listingId, scheduledDate })
            });
            const data = await response.json();

            if (data.success) {
                setRuntimeStatus(data.message);
                setActiveBookingId(data.booking.id);
            } else {
                setRuntimeStatus('Transaction rejected by scheduling rule engine.');
            }
        } catch (error) {
            setRuntimeStatus('Network communication fault encountered.');
        }
    };

    if (!item) return <p style={{ textAlign: 'center' }}>Loading service metadata mapping configuration vectors...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
                <Link to="/" style={{ fontSize: '0.9em', textDecoration: 'none', color: '#0288d1' }}>← Back to Marketplace</Link>
                <h3 style={{ margin: '15px 0 5px 0' }}>{item.title}</h3>
                <p><strong>Campus Vendor:</strong> {item.seller_name} ({item.seller_email})</p>
                <p><strong>Fulfillment Valuation:</strong> KSh {parseFloat(item.price).toLocaleString()}</p>
            </div>

            <div style={{ border: '1px solid #eaeeff', padding: '25px', borderRadius: '6px', backgroundColor: '#fcfdff' }}>
                <h4>Propose Scheduling Parameters</h4>
                <p style={{ fontSize: '0.85em', color: '#555', background: '#fff3e0', borderLeft: '4px solid #ffb74d', padding: '10px' }}>
                    ⚠️ <strong>Operational Constraint Notice:</strong> Direct automated payments are bypassed in this version. The system operates as a scheduling tool. Coordinate payment directly with the vendor upon delivery.
                </p>
                <form onSubmit={handleProcessScheduling}>
                    <input type="datetime-local" required style={{ width: '100%', padding: '10px', margin: '15px 0', boxSizing: 'border-box' }}
                           onChange={(e) => setScheduledDate(e.target.value)} />
                    <button type="submit" disabled={!!activeBookingId} style={{ background: !!activeBookingId ? '#ccc' : '#2e7d32', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '4px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>
                        {activeBookingId ? 'Discovery Confirmed' : 'Transmit Scheduling Request'}
                    </button>
                </form>
                {runtimeStatus && <div style={{ marginTop: '15px', background: '#e8f5e9', padding: '12px', borderRadius: '4px', color: '#2e7d32', fontSize: '0.9em', fontWeight: 'bold' }}>{runtimeStatus}</div>}
            </div>

            {activeBookingId && (
                <ReviewSystem bookingId={activeBookingId} token={token} />
            )}
        </div>
    );
};

export default BookingPanel;