require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const listingRoutes = require('./routes/listings.routes');
const bookingRoutes = require('./routes/bookings.routes');

const app = express();
const PORT = 5000;

// Enforce configuration middleware sequences
app.use(cors());
app.use(express.json());

// Target router tree assignments
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

// Base sanity validation check hook
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'online', details: 'Campus API is responding.' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});