// backend/routes/bookings.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth.middleware');

// Core Transaction Allocation Request Routing Layout
router.post('/', auth, async (req, res) => {
    const { listingId, scheduledDate } = req.body;
    try {
        const newBooking = await db.query(
            'INSERT INTO bookings (buyer_id, listing_id, scheduled_date, status) VALUES ($1, $2, $3, \'pending\') RETURNING *',
            [req.user.id, listingId, scheduledDate]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Booking request sent to vendor. Coordinate your chosen payment method at delivery.',
            booking: newBooking.rows[0]
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Upgraded Notification Discovery Component Lookup Mapping
router.get('/notifications/vendor', auth, async (req, res) => {
    try {
        // Queries all booking requests where the vendor profile id matches the logged-in authenticated user session context
        const queryResult = await db.query(`
            SELECT b.id as booking_id, b.scheduled_date, b.status, l.title as listing_title, u.name as buyer_name
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            JOIN users u ON b.buyer_id = u.id
            WHERE l.seller_id = $1
            ORDER BY b.created_at DESC
        `, [req.user.id]);

        res.status(200).json({ success: true, data: queryResult.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Peer Review Execution Context Gateway
router.post('/reviews', auth, async (req, res) => {
    const { bookingId, rating, comment } = req.body;
    try {
        const bookingCheck = await db.query(
            'SELECT id, buyer_id FROM bookings WHERE id = $1', 
            [bookingId]
        );

        if (bookingCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking context reference missing.' });
        }
        if (bookingCheck.rows[0].buyer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Review generation unauthorized for this transaction context.' });
        }

        const newReview = await db.query(
            'INSERT INTO reviews (booking_id, reviewer_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [bookingId, req.user.id, rating, comment]
        );
        res.status(201).json({ success: true, review: newReview.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Review creation rejected. Ensure single metric submission per booking execution boundary.' });
    }

});

 router.patch('/:bookingId/complete', auth, async (req, res) => {
    const { bookingId } = req.params;
    try {
        // Enforce governance: Only the service provider who owns the listing can mark it complete
        const ownershipCheck = await db.query(`
            SELECT b.id 
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            WHERE b.id = $1 AND l.seller_id = $2
        `, [bookingId, req.user.id]);

        if (ownershipCheck.rows.length === 0) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized. You must be the assigned provider to close this task transaction.' 
            });
        }

        // Update booking row configuration status field
        await db.query(
            "UPDATE bookings SET status = 'completed' WHERE id = $1",
            [bookingId]
        );

        res.status(200).json({ 
            success: true, 
            message: 'Transaction completed. Peer settlement logging finalized.' 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;