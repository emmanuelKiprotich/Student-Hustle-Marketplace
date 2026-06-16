// backend/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'campus_marketplace',
    password: 'hr', // 🔴 Type your actual text password here inside quotes
    port: 5432,
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