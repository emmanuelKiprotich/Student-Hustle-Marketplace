// frontend/src/components/ReviewSystem.jsx
import React, { useState, useEffect } from 'react';

const ReviewSystem = ({ bookingId, token }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState('5');
    const [comment, setComment] = useState('');
    const [msg, setMsg] = useState('');

    const fetchReviews = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/reviews/${bookingId}`);
            const data = await res.json();
            if (data.success) setReviews(data.reviews);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchReviews(); }, [bookingId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/bookings/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ bookingId, rating: parseInt(rating), comment })
            });
            const data = await res.json();
            if (data.success) {
                setMsg('🎉 Feedback submitted successfully!');
                setComment('');
                fetchReviews();
            } else { setMsg(`Error: ${data.message}`); }
        } catch (err) { setMsg('Failed to transmit review parameters.'); }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h4>Peer Feedback ({reviews.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '15px 0' }}>
                {reviews.length === 0 ? <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No feedback vectors logged for this transaction yet.</p> :
                    reviews.map(r => (
                        <div key={r.id} style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', background: 'var(--bg-light)' }}>
                            <strong>{'⭐'.repeat(r.rating)}</strong>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.92em' }}>{r.comment}</p>
                        </div>
                    ))
                }
            </div>
            {token && (
                <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ maxWidth: '150px' }}>
                        <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (Good)</option>
                        <option value="3">⭐⭐⭐ (Average)</option>
                        <option value="2">⭐⭐ (Poor)</option>
                        <option value="1">⭐ (Unsatisfactory)</option>
                    </select>
                    <textarea placeholder="Write an honest peer review regarding fulfillment speed, communication clarity, or product quality..." required value={comment} onChange={(e) => setComment(e.target.value)} rows="3" />
                    <button type="submit" className="primary" style={{ alignSelf: 'flex-start' }}>Submit Peer Review</button>
                    {msg && <p style={{ fontSize: '0.9em', fontWeight: 'bold', color: 'var(--success)' }}>{msg}</p>}
                </form>
            )}
        </div>
    );
};

export default ReviewSystem;