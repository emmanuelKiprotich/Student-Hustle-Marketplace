// components/ServiceDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSystem from './ReviewSystem';

const ServiceDetails = ({ token }) => {
    const { listingId } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/listings/${listingId}`)
            .then(res => res.json())
            .then(data => data.success && setItem(data.listing))
            .catch(err => console.error(err));
    }, [listingId]);

    if (!item) return <p style={{ textAlign: 'center', padding: '40px' }}>Mapping asset configuration arrays...</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div>
                <Link to="/" style={{ textDecoration: 'none', color: '#0288d1', fontWeight: 'bold', fontSize: '0.9em' }}>← Return to Catalog</Link>
                <h1 style={{ margin: '15px 0 10px 0', fontSize: '2.2em', color: '#111' }}>{item.title}</h1>
                <p style={{ background: '#e1f5fe', color: '#0288d1', display: 'inline-block', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold' }}>
                    Verified Student Offer[cite: 1]
                </p>
                
                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Service Parameter Scope</h3>
                <p style={{ color: '#444', lineHeight: '1.6', fontSize: '1.05em' }}>{item.description}</p>
                
                {/* Integration check mapping standard reviews */}
                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Peer Accountability History[cite: 1]</h3>
                    <ReviewSystem bookingId={listingId} token={token} />
                </div>
            </div>

            {/* Interactive Pricing Action Container Sidebar Component */}
            <div>
                <div style={{ border: '1px solid #e0e0e0', padding: '25px', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'sticky', top: '20px' }}>
                    <span style={{ fontSize: '0.85em', color: '#888', textTransform: 'uppercase', display: 'block' }}>Base Settlement Fee</span>
                    <h2 style={{ margin: '5px 0 20px 0', fontSize: '2.2em', color: '#2e7d32', fontWeight: 'bold' }}>
                        KSh {parseFloat(item.price).toLocaleString()}
                    </h2>
                    
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.8em', color: '#666', display: 'block' }}>Peer Vendor Profile</span>
                        <strong>👤 {item.seller_name}</strong>
                        <span style={{ fontSize: '0.85em', color: '#777', display: 'block', marginTop: '3px' }}>📩 {item.seller_email}</span>
                    </div>

                    <Link to={`/booking/${item.id}`} style={{ display: 'block', textDecoration: 'none', background: '#0288d1', color: 'white', textAlign: 'center', padding: '12px', borderRadius: '6px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(2,136,209,0.2)' }}>
                        Book Service Schedule
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;