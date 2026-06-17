// components/AdminDashboard.jsx
import React, { useState } from 'react';

const AdminDashboard = () => {
    // Simulated global administrative management arrays
    const [flaggedItems, setFlaggedItems] = useState([
        { id: 101, title: 'Commercial Academic Assignment Writing', vendor: 'John Doe', reason: 'Policy violation: Academic Plagiarism/Dishonesty' },
        { id: 104, title: 'Unregulated Pharmacy Supplement Drops', vendor: 'Jane Doe', reason: 'Safety violation: Unverified physical health product' }
    ]);

    const handlePurgeListing = (id) => {
        setFlaggedItems(flaggedItems.filter(item => item.id !== id));
        alert(`Listing ID ${id} has been dropped from PostgreSQL state registries.`);
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '3px solid #b71c1c', paddingBottom: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#b71c1c' }}>🛡️ Central Governance Operations Command</h2>
                    <p style={{ margin: '4px 0 0 0', color: '#666' }}>System moderation scope: Strathmore University Micro-Economy Gateway[cite: 1].</p>
                </div>
                <span style={{ background: '#b71c1c', color: 'white', padding: '5px 12px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold' }}>ADMIN SESSION</span>
            </div>

            {/* Core Health Matrices */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <span style={{ fontSize: '0.8em', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Registered Peers</span>
                    <h4 style={{ margin: '5px 0 0 0', fontSize: '1.8em' }}>1,240 students</h4>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <span style={{ fontSize: '0.8em', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Catalog Offers</span>
                    <h4 style={{ margin: '5px 0 0 0', fontSize: '1.8em' }}>342 listings</h4>
                </div>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', borderLeft: '4px solid #b71c1c' }}>
                    <span style={{ fontSize: '0.8em', color: '#b71c1c', fontWeight: 'bold', textTransform: 'uppercase' }}>Moderation Flags Queue</span>
                    <h4 style={{ margin: '5px 0 0 0', fontSize: '1.8em', color: '#b71c1c' }}>{flaggedItems.length} entries</h4>
                </div>
            </div>

            {/* Actionable Moderation Rows Display Queue */}
            <h3>Flagged Activity Escalation Queue</h3>
            {flaggedItems.length === 0 ? (
                <p style={{ color: '#2e7d32', fontStyle: 'italic' }}>Platform registry compliance is completely clean.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {flaggedItems.map(item => (
                        <div key={item.id} style={{ background: '#fff', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h5 style={{ margin: '0 0 5px 0', fontSize: '1.15em', color: '#111' }}>{item.title}</h5>
                                <p style={{ margin: '0 0 4px 0', fontSize: '0.9em', color: '#555' }}><strong>Vendor Account:</strong> {item.vendor}</p>
                                <p style={{ margin: 0, fontSize: '0.9em', color: '#b71c1c' }}><strong>Flag Context:</strong> {item.reason}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handlePurgeListing(item.id)} style={{ background: '#b71c1c', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Purge Listing
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;