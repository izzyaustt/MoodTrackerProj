const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get a random quote
router.get('/quotes', async (req, res) => {
    // Pool of inspirational quotes as fallback
    const fallbackQuotes = [
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { content: "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.", author: "Roy T. Bennett" },
        { content: "The only impossible journey is the one you never begin.", author: "Tony Robbins" }
    ];
    
    try {
        // Try ZenQuotes API (free, no auth required, reliable)
        const response = await axios.get('https://zenquotes.io/api/random', {
            timeout: 3000
        });
        
        if (response.data && response.data[0] && response.data[0].q && response.data[0].a) {
            res.json({
                content: response.data[0].q,
                author: response.data[0].a
            });
        } else {
            // Return random fallback quote
            const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            res.json(randomQuote);
        }
    } catch (err) {
        console.error('Error fetching quote:', err.message);
        // Return random fallback quote
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        res.json(randomQuote);
    }
});

// Get a question of the day (mental health/mindfulness focused)
router.get('/question', async (req, res) => {
    // Fallback reflective questions for mood tracking
    const reflectiveQuestions = [
        "What is one thing you're grateful for today?",
        "What made you smile today?",
        "How did you take care of yourself today?",
        "What challenged you today and how did you handle it?",
        "What is one positive thing you can do for yourself tomorrow?",
        "Who or what made you feel supported today?",
        "What emotion did you feel most strongly today and why?",
        "What is something you learned about yourself today?",
        "How did you show kindness to yourself or others today?",
        "What would you like to let go of from today?",
        "What are you looking forward to?",
        "What made today unique or special?",
        "If today were a color, what would it be and why?",
        "What is one small win you had today?",
        "How did you handle stress or difficult moments today?"
    ];
    
    try {
        console.log('Fetching affirmation from API...');
        // Try Affirmations.dev API with mindfulness/mental health prompts
        const response = await axios.get('https://www.affirmations.dev/', {
            timeout: 5000
        });
        
        console.log('Affirmation API response:', response.data);
        
        if (response.data && response.data.affirmation) {
            // Convert affirmation into a reflective question format
            const affirmation = response.data.affirmation;
            // Create a question based on the affirmation theme
            const question = `Reflect on this: "${affirmation}" - How does this resonate with you today?`;
            console.log('Sending affirmation-based question:', question);
            res.json({
                question: question,
                affirmation: affirmation
            });
        } else {
            console.log('No affirmation in response, using fallback');
            // Return random fallback question
            const randomQuestion = reflectiveQuestions[Math.floor(Math.random() * reflectiveQuestions.length)];
            res.json({
                question: randomQuestion
            });
        }
    } catch (err) {
        console.error('Error fetching affirmation/question:', err.message);
        console.error('Full error:', err);
        // Return random fallback question
        const randomQuestion = reflectiveQuestions[Math.floor(Math.random() * reflectiveQuestions.length)];
        res.json({
            question: randomQuestion
        });
    }
});

module.exports = router;