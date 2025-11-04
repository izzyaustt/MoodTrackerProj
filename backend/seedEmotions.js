require('dotenv').config();
const mongoose = require('mongoose');
const Emotion = require('./models/Emotion');

const db_uri = `mongodb+srv://${process.env.db_user}:${encodeURIComponent(process.env.db_pass)}@vidgame-proj.7oy2xv8.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;

const emotions = [
    { name: 'Happy', description: '😊 Feeling joyful and content' },
    { name: 'Sad', description: '😢 Feeling down or melancholic' },
    { name: 'Angry', description: '😠 Feeling frustrated or upset' },
    { name: 'Anxious', description: '😰 Feeling worried or nervous' },
    { name: 'Tired', description: '😴 Feeling exhausted or sleepy' },
    { name: 'Calm', description: '😌 Feeling peaceful and relaxed' }
];

mongoose.connect(db_uri)
    .then(async () => {
        console.log('MongoDB connected for seeding');

        // Clear existing emotions (optional)
        await Emotion.deleteMany({});
        console.log('Cleared existing emotions');

        // Insert emotions
        const insertedEmotions = await Emotion.insertMany(emotions);
        console.log('Emotions seeded successfully:');
        insertedEmotions.forEach(emotion => {
            console.log(`  - ${emotion.name} (ID: ${emotion._id})`);
        });

        mongoose.disconnect();
        console.log('Done! Copy these IDs to use in your frontend.');
    })
    .catch(err => {
        console.error('Error seeding emotions:', err);
        mongoose.disconnect();
    });
