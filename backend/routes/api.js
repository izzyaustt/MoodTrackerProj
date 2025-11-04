const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get a random quote
router.get('/quotes', async (req, res) => {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch quote :(' });
    }
});

// Get a question of the day (trivia)
router.get('/question', async (req, res) => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        const question = response.data.results[0];
        res.json({
            question: question.question,
            correct_answer: question.correct_answer,
            incorrect_answers: question.incorrect_answers
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch question :(' });
    }
});

module.exports = router;