// routes/listings.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth.middleware');

// Public Service Catalogue Discovery & Search Search Filter Framework
router.get('/search', async (req, res) => {
    const { category, keyword } = req.query;
    try {
        let sql = `
            SELECT l.*, c.name as category_name, u.name as seller_name 
            FROM listings l
            JOIN categories c ON l.category_id = c.id
            JOIN users u ON l.seller_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            params.push(category);
            sql += ` AND c.name = $${params.length}`;
        }

        if (keyword) {
            params.push(`%${keyword}%`);
            sql += ` AND (l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`;
        }

        sql += ' ORDER BY l.created_at DESC';
        const result = await db.query(sql, params);
        res.status(200).json({ success: true, listings: result.rows });
    } catch (err) {
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