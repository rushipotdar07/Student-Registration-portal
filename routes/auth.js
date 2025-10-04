const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { sendOTPEmail } = require('./mailer');

// In-memory OTP storage (consider using Redis in production)
const otpStorage = {}; // {phone: {otp, expires, userData}}

// Utility functions
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateJWT(user) {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Send OTP for registration
// router.post('/send-otp', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
//         const { name, email, phone, password } = req.body;

//         // Validation
//         if (!name || !email || !phone || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All fields are required'
//             });
//         }

//         // Check if user already exists
//         const [existingUsers] = await db.execute(
//             'SELECT id FROM users WHERE email = ? OR phone = ?',
//             [email, phone]
//         );

//         if (existingUsers.length > 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email or phone number already registered'
//             });
//         }

//         // Generate OTP
//         const otp = generateOTP();
//         const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

//         // Store OTP and user data temporarily
//         otpStorage[phone] = {
//             otp,
//             expires,
//             userData: { name, email, phone, password }
//         };

//         // In production, send OTP via SMS gateway
//         console.log(`OTP for ${phone}: ${otp}`);

//         res.json({
//             success: true,
//             message: 'OTP sent successfully',
//             otp: otp // Remove this in production
//         });

//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

router.post('/send-otp', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE email = ? OR phone = ?',
            [email, phone]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number already registered'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutes validity

        // Store OTP and user data temporarily
        otpStorage[phone] = {
            otp,
            expires,
            userData: { name, email, phone, password }
        };

        // Send OTP via email
        const sent = await sendOTPEmail(email, otp);

        if (!sent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email'
            });
        }

        // ✅ Success
        res.json({
            success: true,
            message: 'OTP sent successfully to your email'
            // ⚠️ Do NOT return OTP here in production
        });

    } catch (error) {
        console.error('❌ Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Verify OTP and complete registration
// router.post('/verify-otp', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
//         const { otp, phone } = req.body;

//         if (!otp || !phone) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'OTP and phone number are required'
//             });
//         }

//         // Check if OTP exists and is valid
//         const otpData = otpStorage[phone];
//         if (!otpData) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'OTP not found or expired'
//             });
//         }

//         if (Date.now() > otpData.expires) {
//             delete otpStorage[phone];
//             return res.status(400).json({
//                 success: false,
//                 message: 'OTP expired'
//             });
//         }

//         if (otpData.otp !== otp) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid OTP'
//             });
//         }

//         // Create user
//         const { name, email, password } = otpData.userData;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const [result] = await db.execute(
//             'INSERT INTO users (name, email, phone, password, is_verified, created_at) VALUES (?, ?, ?, ?, TRUE, NOW())',
//             [name, email, phone, hashedPassword]
//         );

//         // Clean up OTP storage
//         delete otpStorage[phone];

//         // Get the created user
//         const [userRows] = await db.execute(
//             'SELECT id, name, email, phone, is_verified, created_at FROM users WHERE id = ?',
//             [result.insertId]
//         );

//         const user = userRows[0];

//         // Generate JWT
//         const token = generateJWT(user);

//         res.json({
//             success: true,
//             message: 'Registration successful',
//             user: user,
//             token
//         });

//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

router.post('/verify-otp', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { otp, phone } = req.body;

        if (!otp || !phone) {
            return res.status(400).json({
                success: false,
                message: 'OTP and phone number are required'
            });
        }

        // Check if OTP exists
        const otpData = otpStorage[phone];
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found or expired'
            });
        }

        // Check expiry
        if (Date.now() > otpData.expires) {
            delete otpStorage[phone];
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            });
        }

        // Validate OTP
        if (otpData.otp.toString() !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // ✅ OTP Verified → Insert User in DB
        const { name, email, password } = otpData.userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            `INSERT INTO users (name, email, phone, password, is_verified, created_at) 
             VALUES (?, ?, ?, ?, TRUE, NOW())`,
            [name, email, phone, hashedPassword]
        );

        // Clean up OTP store
        delete otpStorage[phone];

        // Get created user
        const [userRows] = await db.execute(
            'SELECT id, name, email, phone, is_verified, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        const user = userRows[0];

        // Generate JWT
        const token = generateJWT(user);

        res.json({
            success: true,
            message: 'Registration successful 🎉',
            user,
            token
        });

    } catch (error) {
        console.error('❌ Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


// // Resend OTP
// router.post('/resend-otp', (req, res) => {
//     try {
//         const { phone } = req.body;

//         if (!phone) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Phone number is required'
//             });
//         }

//         // Check if OTP data exists
//         const otpData = otpStorage[phone];
//         if (!otpData) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'No pending registration found for this number'
//             });
//         }

//         // Generate new OTP
//         const otp = generateOTP();
//         const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

//         // Update OTP data
//         otpStorage[phone].otp = otp;
//         otpStorage[phone].expires = expires;

//         // In production, send OTP via SMS gateway
//         console.log(`New OTP for ${phone}: ${otp}`);

//         res.json({
//             success: true,
//             message: 'OTP resent successfully',
//             otp: otp // Remove this in production
//         });

//     } catch (error) {
//         console.error('Error resending OTP:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

// User login

// Resend OTP
// Resend OTP
// Resend OTP
// Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const otpData = otpStorage[phone];
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: 'No pending registration found for this number'
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const expires = Date.now() + 10 * 60 * 1000;

        otpStorage[phone].otp = otp;
        otpStorage[phone].expires = expires;

        console.log(`New OTP for ${phone}: ${otp}`);

        // ✅ Fix: email is inside userData
        const email = otpData.userData?.email;

        if (email) {
            try {
                await sendOTPEmail(email, otp);
                console.log(`✅ OTP email resent to: ${email}`);
            } catch (err) {
                console.error("❌ Failed to send OTP email:", err.message);
            }
        } else {
            console.log("⚠️ No email linked with this phone, skipping email sending.");
        }

        res.json({
            success: true,
            message: 'OTP resent successfully',
            otp // ⚠️ remove in production
        });

    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});




router.post('/login', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const [userRows] = await db.execute(
            'SELECT id, name, email, phone, password, is_verified, created_at FROM users WHERE email = ?',
            [email]
        );

        if (userRows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = userRows[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT
        const token = generateJWT(user);

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.json({
            success: true,
            message: 'Login successful',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Cleanup expired OTPs (runs every 15 minutes)
setInterval(() => {
    const now = Date.now();
    Object.keys(otpStorage).forEach(phone => {
        if (otpStorage[phone].expires < now) {
            delete otpStorage[phone];
            console.log(`Cleaned up expired OTP for ${phone}`);
        }
    });
}, 15 * 60 * 1000);

module.exports = router;