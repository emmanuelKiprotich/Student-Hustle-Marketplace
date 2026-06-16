// components/ReviewSystem.jsx
import React, { useState } from 'react';

const ReviewSystem = ({ bookingId, token }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [uiStatus, setUiStatus] = useState('');

    const handlePublishMetrics = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/bookings/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ bookingId, rating, comment })
            });
            const data = await response.json();

            if (data.success) {
                setUiStatus('Review published successfully. Peer reputation matrix updated.');
            } else {
                setUiStatus(`Submission denied: ${data.message}`);
            }
        } catch (err) {
            setUiStatus('Network error occurred while transmitting metrics.');
        }
    };

    return (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '6px', border: '1px dashed #ccc' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Fulfillment Loop Review Feedback</h4>
            <form onSubmit={handlePublishMetrics}>
                <label style={{ fontSize: '0.9em', fontWeight: 'bold' }}>Rating Assignment Metric:</label><br/>
                <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} style={{ width: '100%', padding: '8px', margin: '5px 0 15px 0' }}>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent Quality Execution</option>
                    <option value="4">⭐⭐⭐⭐ Satisfactory Metrics Delivered</option>
                    <option value="3">⭐⭐⭐ Neutral Experience Vector</option>
                    <option value="2">⭐⭐ Unsatisfactory Output Quality</option>
                    <option value="1">⭐ Critical Failure / Non-Delivery</option>
                </select><br/>
                <textarea placeholder="Provide concise review commentary supporting peer service classification matrices..." required rows="3" style={{ width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '15px' }}
                          onChange={(e) => setComment(e.target.value)} /><br/>
                <button type="submit" style={{ background: '#0288d1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Publish Accountability Metric
                </button>
            </form>
            {uiStatus && <p style={{ color: '#0288d1', fontWeight: 'bold', fontSize: '0.9em', marginTop: '10px' }}>{uiStatus}</p>}
        </div>
    );
};

export default ReviewSystem;