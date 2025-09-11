const User = require('../schema/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
    // Get credentials from client side
    const { username, password } = req.body;
    
    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        // Find user in database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Username does not exist!!' 
            });
        }
       
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'The password you have entered is wrong...'
            });
        }

        // Create JWT payload with user info
        const payload = {
            userId: user._id,
            username: user.username,
            email: user.email,
            loginTime: Date.now()
        };

        // Generate JWT token
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY || 'xY7!kL9@qW3nR$sE5vG2#mP8&wZ6^tB1uN4oQcV7jX2%aF9',
            { expiresIn: '24h' } // 24 hours expiration
        );

        // Set token in HTTP-only cookie (secure)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Return success response with user info (but NOT the token)
        return res.json({
            success: true,
            message: 'Login Successful',
            user: { 
                id: user._id,
                username: user.username,
                email: user.email
            }
            // Note: Token is NOT sent in response body - it's in cookies only
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while logging in'
        });
    }
};

module.exports = { login };