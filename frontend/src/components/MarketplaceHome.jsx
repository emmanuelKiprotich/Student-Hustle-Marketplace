// frontend/src/components/MarketplaceHome.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MarketplaceHome = ({ token }) => {
    const [listings, setListings] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    // Explicit category listing mapping directly to database primary keys
    const categoriesList = [
        { id: '', name: '✨ All Services' },
        { id: 1, name: '🎨 Graphics & Design' },
        { id: 2, name: '💻 Tech & Repairs' },
        { id: 3, name: '🍰 Food & Baking' },
        { id: 4, name: '🧵 Apparel & Tailoring' }
    ];

    // State parameters for listing products/services
    const [showSellModal, setShowSellModal] = useState(false);
    const [newListing, setNewListing] = useState({ title: '', description: '', price: '', category_id: '1' });
    const [formMessage, setFormMessage] = useState('');

    // 🚀 UNIFIED FILTER RETRIEVAL ENGINE
    const loadPlatformOffers = async (catId = selectedCategoryId) => {
        try {
            let url = `http://localhost:5000/api/listings/search?`;
            
            // Build unified query parameters string
            if (catId) {
                url += `category_id=${catId}&`;
            }
            if (searchKeyword) {
                url += `keyword=${encodeURIComponent(searchKeyword)}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setListings(data.listings);
            }
        } catch (err) {
            console.error('Error synchronizing database listings query:', err);
        }
    };

    // Automatically trigger database reload whenever a category filter updates
    useEffect(() => {
        loadPlatformOffers(selectedCategoryId);
    }, [selectedCategoryId]);

    // Handle immediate user category pill clicks
    const handleCategorySelect = (id) => {
        setSelectedCategoryId(id);
    };

    // Handle search input submissions
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        loadPlatformOffers(selectedCategoryId);
    };

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
                setFormMessage('🎉 Side hustle item added successfully!');
                setNewListing({ title: '', description: '', price: '', category_id: '1' });
                loadPlatformOffers(selectedCategoryId); 
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
            
            {/* Top Action Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.6em' }}>Discover Campus Talents</h3>
                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '0.95em' }}>Support peer entrepreneurs. Hyperlocal fulfillment without commission markups.</p>
                </div>
                {token && (
                    <button 
                        onClick={() => setShowSellModal(true)}
                        style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95em' }}
                    >
                        ➕ List Your Side Hustle
                    </button>
                )}
            </div>

            {/* 🔍 SEARCH BAR WORKSPACE CONTAINER */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                <input 
                    type="text" 
                    placeholder="What are you looking for today? (e.g., cake baking, poster design, laptop repair)..." 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1em' }}
                />
                <button 
                    type="submit" 
                    className="primary"
                    style={{ padding: '0 30px', borderRadius: '8px', height: '52px' }}
                >
                    Search
                </button>
            </form>

            {/* 🏷️ CATEGORY PILL RIBBON NAVIGATOR */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
                {categoriesList.map((cat) => {
                    const isActive = selectedCategoryId === cat.id;
                    return (
                        <button 
                            key={cat.id} 
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`category-pill ${isActive ? 'active' : ''}`}
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>

            {/* Dynamic Card Display Grid Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {listings.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                        <p style={{ fontSize: '1.2em', color: 'var(--text-muted)', margin: 0 }}>No active campus service entries found matching this scope.</p>
                    </div>
                ) : (
                    listings.map((item) => (
                        <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <span style={{ background: 'var(--success-light)', color: 'var(--success)', fontSize: '0.78em', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {item.category_name}
                                </span>
                                <h4 style={{ margin: '15px 0 8px 0', fontSize: '1.25em', lineHeight: '1.4' }}>
                                    {item.title}
                                </h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.92em', margin: '0 0 20px 0', lineHeight: '1.5', minHeight: '45px' }}>
                                    {item.description}
                                </p>
                            </div>
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '0.75em', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Student Provider</span>
                                    <strong>👤 {item.seller_name}</strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1.4em', fontWeight: 'bold', color: 'var(--success)', display: 'block' }}>
                                        KSh {parseFloat(item.price).toLocaleString()}
                                    </span>
                                    {token ? (
                                        <Link to={`/service/${item.id}`} style={{ display: 'inline-block', color: 'var(--primary)', fontSize: '0.88em', textDecoration: 'none', marginTop: '6px', fontWeight: 'bold' }}>
                                            Book Discovery Request →
                                        </Link>
                                    ) : (
                                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8em', fontStyle: 'italic', marginTop: '4px' }}>Session login required</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Creation Modal View Portal */}
            {showSellModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>Monetize Your Campus Skill</h3>
                        <p style={{ fontSize: '0.9em', color: 'var(--text-muted)', marginBottom: '20px' }}>Fill out your portfolio details below to register your side hustle in the central directory.</p>
                        
                        <form onSubmit={handleCreateListing} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Service Title</label>
                                <input type="text" placeholder="e.g., Fast Laptop Repair & Software Install" required value={newListing.title} onChange={(e) => setNewListing({...newListing, title: e.target.value})} />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Target Category</label>
                                <select value={newListing.category_id} onChange={(e) => setNewListing({...newListing, category_id: e.target.value})}>
                                    <option value="1">Graphics & Design</option>
                                    <option value="2">Tech & Repairs</option>
                                    <option value="3">Food & Baking</option>
                                    <option value="4">Apparel & Tailoring</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Base Fulfillment Price (KSh)</label>
                                <input type="number" placeholder="e.g., 500" required value={newListing.price} onChange={(e) => setNewListing({...newListing, price: e.target.value})} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>Detailed Description</label>
                                <textarea placeholder="Describe what peer consumers will receive..." required rows="4" value={newListing.description} onChange={(e) => setNewListing({...newListing, description: e.target.value})} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowSellModal(false)} style={{ background: '#f5f5f5', color: '#333' }}>Cancel</button>
                                <button type="submit" className="primary">Publish Service</button>
                            </div>
                        </form>
                        {formMessage && <div style={{ marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '6px', fontSize: '0.9em', textAlign: 'center', fontWeight: 'bold', color: 'var(--success)' }}>{formMessage}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplaceHome;