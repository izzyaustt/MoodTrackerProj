const express = require('express');
const router = express.Router();
const Emotion = require('../models/Emotion');

// Get all emotions
router.get('/', async (req, res) => {
    try {
        const emotions = await Emotion.find();
        res.json(emotions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
