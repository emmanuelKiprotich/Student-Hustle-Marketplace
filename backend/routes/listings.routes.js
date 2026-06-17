// routes/listings.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth.middleware');

// Public Service Catalogue Discovery & Search Search Filter Framework
router.get('/search', async (req, res) => {
    // 🔴 Crucial change: Accept category_id as a query parameter
    const { category_id, keyword } = req.query; 
    
    try {
        let sql = `
            SELECT l.*, c.name as category_name, u.name as seller_name 
            FROM listings l
            JOIN categories c ON l.category_id = c.id
            JOIN users u ON l.seller_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // 1. Handle numeric category filtering safely
        if (category_id) {
            params.push(parseInt(category_id));
            sql += ` AND l.category_id = $${params.length}`;
        }

        // 2. Handle textual search keyword filtering
        if (keyword) {
            params.push(`%${keyword}%`);
            sql += ` AND (l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`;
        }

        // Return latest listings first
        sql += ' ORDER BY l.created_at DESC';

        const result = await db.query(sql, params);
        res.status(200).json({ success: true, listings: result.rows });
    } catch (err) {
        console.error("Backend filter engine failure:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Single service lookup view
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT l.*, u.name as seller_name, u.email as seller_email 
            FROM listings l 
            JOIN users u ON l.seller_id = u.id 
            WHERE l.id = $1`, 
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Portfolio service entry not found.' });
        }
        res.status(200).json({ success: true, listing: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/dashboard/metrics', auth, async (req, res) => {
    try {
        const sellerId = req.user.userId; // Captured securely via your verified JWT payload

        // 1. Fetch listings owned by this specific student provider
        const listingsQuery = await db.query(
            'SELECT * FROM listings WHERE seller_id = $1 ORDER BY created_at DESC',
            [sellerId]
        );

        // 2. Fetch total bookings and calculated capital generation summary metrics
        const metricsQuery = await db.query(`
            SELECT 
                COUNT(b.id) as total_requests,
                SUM(CASE WHEN b.status = 'completed' THEN l.price ELSE 0 END) as total_earnings
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            WHERE l.seller_id = $1
        `, [sellerId]);

        // 3. Fetch active ongoing order execution tasks
        const activeOrdersQuery = await db.query(`
            SELECT b.id, b.status, b.scheduled_date, l.title, u.name as buyer_name
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            JOIN users u ON b.buyer_id = u.id
            WHERE l.seller_id = $1 AND b.status = 'pending'
            ORDER BY b.scheduled_date ASC
        `, [sellerId]);

        res.status(200).json({
            success: true,
            listings: listingsQuery.rows,
            summary: {
                totalRequests: parseInt(metricsQuery.rows[0].total_requests) || 0,
                totalEarnings: parseFloat(metricsQuery.rows[0].total_earnings) || 0
            },
            activeOrders: activeOrdersQuery.rows
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Restricted Route: Create portfolio catalog entry
router.post('/', auth, async (req, res) => {
    const { title, description, price, category_id } = req.body;
    try {
        const newListing = await db.query(
            'INSERT INTO listings (seller_id, category_id, title, description, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, category_id, title, description, price]
        );
        res.status(201).json({ success: true, listing: newListing.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});



module.exports = router;