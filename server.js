require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const db = require('./config/db');  //  This is correct for server.js // Corrected path to db connection

// Import routes
const authRoutes = require('./routes/auth.routes'); // Corrected path to auth.routes.js
const listingRoutes = require('./routes/listings.routes'); // Corrected path to listings.routes.js
const bookingRoutes = require('./routes/bookings.routes'); // Corrected path to bookings.routes.js

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Test DB connection (optional, for initial setup verification)
db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

// Route Middlewares (Added from the root server.js for completeness)
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});