// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('../config/db');

// 🔴 1. EXPLICIT SMTP TRANSPORTER CONFIGURATION (Google Workspace / SSL)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Bypasses strict local certificate checks
    }
});

// --- ROUTES ---

// 🆕 1. Register New Student Profile
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Prevent duplicate emails
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Profile already exists in the system.' });
        }

        // Hash password securely
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Store new profile
        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, passwordHash]
        );

        res.status(201).json({ 
            success: true, 
            user: newUser.rows[0], 
            message: 'Registration successful. You can now log in.' 
        });
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// 🔐 2. Initial Login Flow (Validates credentials & triggers 2FA Email)
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

        // Generate temporary random 6-digit number profile
        const tfaCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Valid for exactly 5 minutes

        // Save OTP hash parameters to the database
        await db.query(
            'UPDATE users SET tfa_code = $1, tfa_expires_at = $2 WHERE id = $3',
            [tfaCode, expiresAt, user.id]
        );

        // Construct and dispatch the secure email payload
        const emailOptions = {
            from: `"Campus Side-Hustle Hub 🏫" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: '🔒 Your Interactive 2FA Verification Challenge Code',
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #0288d1; margin-top: 0; text-align: center;">Security Gateway</h2>
                    <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
                    <p style="font-size: 1rem; color: #2d3748;">Habari, <strong>${user.name}</strong>,</p>
                    <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.5;">A session request was initialized under your campus profile credentials. Enter the verification challenge code below to access the marketplace ecosystem:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; font-family: monospace; font-size: 2.25rem; font-weight: 800; letter-spacing: 6px; color: #0f172a; background-color: #f1f5f9; padding: 12px 28px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                            ${tfaCode}
                        </span>
                    </div>
                    
                    <p style="font-size: 0.82rem; color: #e53935; text-align: center; font-weight: 600; margin: 0;">
                        ⏳ This token expires automatically in exactly 5 minutes.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 25px 0;" />
                    <small style="color: #a0aec0; display: block; text-align: center;">If you did not make this request, please update your account credentials immediately.</small>
                </div>
            `
        };

        // Fire transaction mail over secure SSL line
        await transporter.sendMail(emailOptions);
        console.log(`✉️ Real-time 2FA security mail successfully dispatched to: ${user.email}`);

        res.status(200).json({
            success: true,
            requires2FA: true,
            userId: user.id,
            message: 'Primary credentials accepted. Please verify the secure 2FA challenge code dispatched to your student email inbox.'
        });
    } catch (err) {
        console.error("Mail subsystem crash:", err.message);
        res.status(500).json({ success: false, message: 'Failed to process authentication security emails.' });
    }
});

// 🛡️ 3. Verify 2FA Challenge & Issue Final Session JWT
router.post('/verify-2fa', async (req, res) => {
    const { userId, tfaCode } = req.body;
    
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User profile mapping not found.' });
        }

        const user = result.rows[0];

        // 🔴 SMOKING GUN LOGS - Watch your terminal for these!
        console.log("--- 2FA VERIFICATION ATTEMPT ---");
        console.log("Code from Frontend:", `"${tfaCode}"`);
        console.log("Code in Database:", `"${user.tfa_code}"`);
        console.log("Current Server Time:", new Date());
        console.log("Database Expiration Time:", new Date(user.tfa_expires_at));
        console.log("--------------------------------");

        // 1. Check if the code matches (using .trim() to kill invisible spaces)
        // Inside backend/routes/auth.routes.js (Inside /verify-2fa)

        // 1. Aggressively strip ALL spaces from both codes
        const cleanDbCode = String(user.tfa_code).replace(/\s/g, '');
        const cleanInputCode = String(tfaCode).replace(/\s/g, '');

        if (cleanDbCode !== cleanInputCode) {
            console.log(`❌ FAILED: DB Code '${cleanDbCode}' !== Input Code '${cleanInputCode}'`);
            return res.status(401).json({ success: false, message: 'Invalid 2FA challenge code.' });
        }

        // 2. Check if the code has expired
        if (new Date() > new Date(user.tfa_expires_at)) {
            console.log("❌ FAILED: Code is expired.");
            return res.status(401).json({ success: false, message: '2FA challenge code has expired.' });
        };

        // Security Wipe
        await db.query('UPDATE users SET tfa_code = NULL, tfa_expires_at = NULL WHERE id = $1', [userId]);

        // Generate final access token
        const token = jwt.sign(
            { userId: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET || 'STRATHMORE_SECRET_KEY_2026_COMP_SCI',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin }
        });
    } catch (err) {
        console.error("2FA Verification Error:", err.message);
        res.status(500).json({ success: false, message: 'Failed to verify 2FA challenge.' });
    }
});

module.exports = router;