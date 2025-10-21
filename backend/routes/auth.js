const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        const user = new User({ username, password });
        await user.save();
        req.session.userId = user._id;
        res.status(201).json({ message: 'User registered and logged in', user: { id: user._id, username: user.username } });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.session.userId = user._id;
        res.json({ message: 'Logged in', user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.json({ message: 'Logged out' });
    });
});

// Get current user (for checking session)
router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({ userId: req.session.userId });
});

module.exports = router;
