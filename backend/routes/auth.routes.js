// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registration Gateway Endpoint
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const allowedDomain = process.env.ALLOWED_CAMPUS_DOMAIN || 'strathmore.edu';
        if (!email.endsWith(`@${allowedDomain}`) && !email.endsWith('.edu')) {
            return res.status(400).json({ 
                success: false, 
                message: `Registration rejected. Access requires a valid @${allowedDomain} identity configuration.` 
            });
        }

        const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Identity metrics match an existing profile.' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash, is_verified) VALUES ($1, $2, $3, true) RETURNING id, name, email',
            [name, email, passwordHash]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Campus identity validated and initialized successfully.',
            user: newUser.rows[0]
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Phase 1 Login Verification: Code Generation Security Gateway
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials provided.' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials provided.' });
        }

        // Generate a cryptographically simulated 6-digit transient code vector
        const tfaCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5-minute security lifespan

        await db.query(
            'UPDATE users SET tfa_code = $1, tfa_expires_at = $2 WHERE id = $3',
            [tfaCode, expiresAt, user.id]
        );

        // 🟢 SIMULATED ROUTING LOG (Grab your code directly from this terminal panel)
        console.log(`\n========== 🔐 SECURITY GATEWAY 2FA CODE ==========`);
        console.log(`STUDENT PROFILE: ${user.name} (${user.email})`);
        console.log(`YOUR INTERACTIVE 2FA CHALLENGE CODE IS: ${tfaCode}`);
        console.log(`==================================================\n`);

        res.status(200).json({
            success: true,
            requires2FA: true,
            userId: user.id,
            message: 'Primary credentials accepted. Enter the 2FA code logged in your backend console window.'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Phase 2 Validation Challenge: Cryptographic Core Token Issuance
router.post('/verify-2fa', async (req, res) => {
    const { userId, code } = req.body;
    try {
        const result = await db.query(
            'SELECT * FROM users WHERE id = $1 AND tfa_code = $2 AND tfa_expires_at > NOW()',
            [userId, code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired 2FA verification token.' });
        }

        const user = result.rows[0];
        
        // Wipe verification variables immediately upon successful verification to guarantee single-use compliance
        await db.query('UPDATE users SET tfa_code = NULL, tfa_expires_at = NULL WHERE id = $1', [user.id]);

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'FALLBACK_SECRET',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;