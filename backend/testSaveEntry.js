require('dotenv').config();
const mongoose = require('mongoose');
const MoodEntry = require('./models/MoodEntry');
const User = require('./models/User');
const Emotion = require('./models/Emotion');

const db_uri = `mongodb+srv://${process.env.db_user}:${encodeURIComponent(process.env.db_pass)}@moodtracker.3rbfrr1.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;

async function testSaveEntry() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(db_uri);
        console.log('Connected to MongoDB\n');

        // Find a user (or use the first user available)
        const user = await User.findOne();
        if (!user) {
            console.log('❌ No users found! Please register a user first.');
            process.exit(1);
        }
        console.log(`✅ Found user: ${user.email} (ID: ${user._id})`);

        // Find an emotion
        const emotion = await Emotion.findOne();
        if (!emotion) {
            console.log('❌ No emotions found! Please seed emotions first.');
            process.exit(1);
        }
        console.log(`✅ Found emotion: ${emotion.description}\n`);

        // Create a test mood entry
        console.log('Creating test mood entry...');
        const testEntry = new MoodEntry({
            user: user._id,
            emotion: emotion._id,
            quick_write: 'This is a test entry to verify database saving works!',
            question_answer: 'Testing the question answer field',
            duration: 0,
            startTime: new Date(),
            endTime: new Date()
        });

        await testEntry.save();
        console.log('✅ Test entry saved successfully!\n');
        console.log('Entry details:');
        console.log(`  - Entry ID: ${testEntry._id}`);
        console.log(`  - User: ${user.email}`);
        console.log(`  - Emotion: ${emotion.description}`);
        console.log(`  - Quick Write: ${testEntry.quick_write}`);
        console.log(`  - Question Answer: ${testEntry.question_answer}`);
        console.log(`  - Created At: ${testEntry.createdAt}\n`);

        // Retrieve all mood entries for this user to verify
        const allEntries = await MoodEntry.find({ user: user._id }).populate('emotion');
        console.log(`📊 Total mood entries for ${user.email}: ${allEntries.length}`);
        
        if (allEntries.length > 0) {
            console.log('\nAll entries:');
            allEntries.forEach((entry, index) => {
                console.log(`  ${index + 1}. [${entry.createdAt.toLocaleDateString()}] ${entry.emotion.description} - "${entry.quick_write.substring(0, 50)}..."`);
            });
        }

        console.log('\n✅ Database save test completed successfully!');
        console.log('\nTo delete the test entry, use MongoDB Compass or run:');
        console.log(`MoodEntry.findByIdAndDelete('${testEntry._id}')`);

    } catch (err) {
        console.error('❌ Error during test:', err.message);
        console.error(err);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed.');
        process.exit(0);
    }
}

testSaveEntry();
