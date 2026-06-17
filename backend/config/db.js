// backend/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'campus_marketplace',
    password: 'hr', // 🔴 Type your actual text password here inside quotes
    port: 5432,
    max: 20, // 🔴 Allow up to 20 concurrent database connections simultaneously
    idleTimeoutMillis: 30000, // Close idle connections automatically after 30 seconds
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    console.log('PostgreSQL relational persistence layer interconnected successfully.');
});

pool.on('error', (err) => {
    console.error('Unexpected database client error:', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};