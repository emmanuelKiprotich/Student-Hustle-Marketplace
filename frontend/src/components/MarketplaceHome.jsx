// frontend/src/components/MarketplaceHome.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MarketplaceHome = ({ token }) => {
    const [listings, setListings] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    
    // Explicit category objects containing database primary key IDs for bulletproof filtering
    const categoriesList = [
        { id: '', name: '✨ All Services' },
        { id: 1, name: '🎨 Graphics & Design' },
        { id: 2, name: '💻 Tech & Repairs' },
        { id: 3, name: '🍰 Food & Baking' },
        { id: 4, name: '🧵 Apparel & Tailoring' }
    ];
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    // State parameters for the "Create/Sell an Item" form interface
    const [showSellModal, setShowSellModal] = useState(false);
    const [newListing, setNewListing] = useState({ title: '', description: '', price: '', category_id: '1' });
    const [formMessage, setFormMessage] = useState('');

    // Fetch listings based on chosen parameters
    const loadPlatformOffers = async () => {
        try {
            let url = `http://localhost:5000/api/listings/search?`;
            
            // Map directly to DB relational integrity columns
            if (selectedCategoryId) url += `category_id=${selectedCategoryId}&`;
            if (searchKeyword) url += `keyword=${encodeURIComponent(searchKeyword)}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setListings(data.listings);
            }
        } catch (err) {
            console.error('Error establishing database state synchronization:', err);
        }
    };

    useEffect(() => {
        loadPlatformOffers();
    }, [selectedCategoryId]);

    // Handle creation of new campus market items
    const handleCreateListing = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/listings', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newListing.title,
                    description: newListing.description,
                    price: parseFloat(newListing.price),
                    category_id: parseInt(newListing.category_id)
                })
            });
            const data = await response.json();
            
            if (data.success) {
                setFormMessage('🎉 Side hustle portfolio item listed successfully!');
                setNewListing({ title: '', description: '', price: '', category_id: '1' });
                loadPlatformOffers(); // Re-fetch list immediately
                setTimeout(() => { setShowSellModal(false); setFormMessage(''); }, 1500);
            } else {
                setFormMessage(`Error: ${data.message}`);
            }
        } catch (err) {
            setFormMessage('Failed to transmit item parameters to API routing gateway.');
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px' }}>
            
            {/* Action Bar Sub-Header Layout */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#111', fontSize: '1.6em' }}>Discover Campus Talents</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.95em' }}>Support peer entrepreneurs. Hyperlocal fulfillment without commission markups.</p>
                </div>
                {token && (
                    <button 
                        onClick={() => setShowSellModal(true)}
                        style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95em', boxShadow: '0 2px 4px rgba(46,125,50,0.2)', transition: '0.2s' }}
                    >
                        ➕ List Your Side Hustle
                    </button>
                )}
            </div>

            {/* Core Dynamic Search Bar Component */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                <input 
                    type="text" 
                    placeholder="What are you looking for today? (e.g., cake baking, poster design, laptop repair)..." 
                    style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1em', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', outline: 'none' }}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadPlatformOffers()}
                />
                <button 
                    onClick={loadPlatformOffers} 
                    style={{ background: '#0288d1', color: 'white', border: 'none', padding: '0 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em', boxShadow: '0 2px 4px rgba(2,136,209,0.2)' }}
                >
                    Search
                </button>
            </div>

            {/* Upgraded Category Ribbon Navigator */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
                {categoriesList.map((cat) => {
                    const isActive = selectedCategoryId === cat.id;
                    return (
                        <button 
                            key={cat.id} 
                            onClick={() => setSelectedCategoryId(cat.id)}
                            style={{ 
                                padding: '10px 20px', 
                                borderRadius: '20px', 
                                border: isActive ? 'none' : '1px solid #e0e0e0', 
                                background: isActive ? '#0288d1' : '#fff', 
                                color: isActive ? '#fff' : '#555', 
                                cursor: 'pointer',
                                fontWeight: isActive ? 'bold' : 'normal',
                                fontSize: '0.92em',
                                boxShadow: isActive ? '0 3px 8px rgba(2,136,209,0.3)' : '0 1px 2px rgba(0,0,0,0.02)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            {/* Dynamic Catalog Cards Display Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {listings.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '8px', border: '1px dashed #ccc' }}>
                        <p style={{ fontSize: '1.2em', color: '#777', margin: 0 }}>No active campus service entries found matching this scope.</p>
                        <p style={{ fontSize: '0.9em', color: '#999', marginTop: '8px' }}>Be the first to create an offer in this domain category list!</p>
                    </div>
                ) : (
                    listings.map((item) => (
                        <div 
                            key={item.id} 
                            style={{ 
                                border: '1px solid #eef0f2', 
                                borderRadius: '12px', 
                                padding: '24px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between', 
                                background: '#ffffff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'default'
                            }}
                        >
                            <div>
                                <span style={{ background: '#e1f5fe', color: '#0288d1', fontSize: '0.78em', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {item.category_name}
                                </span>
                                <h4 style={{ margin: '15px 0 8px 0', fontSize: '1.25em', color: '#111', fontWeight: '600', lineHeight: '1.4' }}>
                                    {item.title}
                                </h4>
                                <p style={{ color: '#666', fontSize: '0.92em', margin: '0 0 20px 0', lineHeight: '1.5', minHeight: '45px' }}>
                                    {item.description}
                                </p>
                            </div>
                            <div style={{ borderTop: '1px solid #f0f2f5', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.75em', color: '#999', display: 'block', textTransform: 'uppercase' }}>Student Provider</span>
                                    <strong style={{ fontSize: '0.95em', color: '#333' }}>👤 {item.seller_name}</strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#2e7d32', display: 'block' }}>
                                        KSh {parseFloat(item.price).toLocaleString()}
                                    </span>
                                    {token ? (
                                        <Link to={`/booking/${item.id}`} style={{ display: 'inline-block', color: '#0288d1', fontSize: '0.88em', textDecoration: 'none', marginTop: '6px', fontWeight: 'bold' }}>
                                            Book Discovery Request →
                                        </Link>
                                    ) : (
                                        <span style={{ display: 'block', color: '#888', fontSize: '0.8em', fontStyle: 'italic', marginTop: '4px' }}>Session login required</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upgraded Modal Form View: Create/Sell Portals */}
            {showSellModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', position: 'relative' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#111' }}>Monetize Your Campus Skill</h3>
                        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '20px' }}>Fill out your portfolio details below to register your side hustle in the central directory.</p>
                        
                        <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Service Title</label>
                                <input type="text" placeholder="e.g., Fast Laptop Repair & Software Install" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                    value={newListing.title} onChange={(e) => setNewListing({...newListing, title: e.target.value})} />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Target Category</label>
                                <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                    value={newListing.category_id} onChange={(e) => setNewListing({...newListing, category_id: e.target.value})}>
                                    <option value="1">Graphics & Design</option>
                                    <option value="2">Tech & Repairs</option>
                                    <option value="3">Food & Baking</option>
                                    <option value="4">Apparel & Tailoring</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Base Fulfillment Price (KSh)</label>
                                <input type="number" placeholder="e.g., 500" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                    value={newListing.price} onChange={(e) => setNewListing({...newListing, price: e.target.value})} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Detailed Description</label>
                                <textarea placeholder="Describe exactly what your peer consumers will receive, delivery turnaround times, or requirements..." required rows="4" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }}
                                    value={newListing.description} onChange={(e) => setNewListing({...newListing, description: e.target.value})} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowSellModal(false)} style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                                <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Publish Service</button>
                            </div>
                        </form>
                        {formMessage && <div style={{ marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '6px', fontSize: '0.9em', textAlign: 'center', fontWeight: 'bold', color: '#2e7d32' }}>{formMessage}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplaceHome;