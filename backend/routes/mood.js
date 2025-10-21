const express = require('express');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};

// Get all mood entries for the user
router.get('/', requireAuth, async (req, res) => {
    try {
        const entries = await MoodEntry.find({ user: req.session.userId }).populate('emotion');
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new mood entry
router.post('/', requireAuth, async (req, res) => {
    try {
        const { emotion, quick_write, question_answer, duration, startTime, endTime } = req.body;
        const entry = new MoodEntry({
            user: req.session.userId,
            emotion,
            quick_write,
            question_answer,
            duration,
            startTime,
            endTime
        });
        await entry.save();
        await entry.populate('emotion');
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a mood entry
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { emotion, quick_write, question_answer, duration, startTime, endTime } = req.body;
        const entry = await MoodEntry.findOneAndUpdate(
            { _id: req.params.id, user: req.session.userId },
            { emotion, quick_write, question_answer, duration, startTime, endTime },
            { new: true }
        ).populate('emotion');
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a mood entry
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const entry = await MoodEntry.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json({ message: 'Entry deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
