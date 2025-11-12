require('dotenv').config();
const mongoose = require('mongoose');
const MoodEntry = require('./models/MoodEntry');
const User = require('./models/User');

const db_uri = `mongodb+srv://${process.env.db_user}:${encodeURIComponent(process.env.db_pass)}@moodtracker.3rbfrr1.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;

async function checkEntries() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(db_uri);
        console.log('✅ Connected to MongoDB\n');

        // Get all users
        const users = await User.find();
        console.log(`📊 Total users in database: ${users.length}`);
        
        if (users.length === 0) {
            console.log('\n⚠️  No users found. Please register a user through the frontend first.');
            console.log('   1. Start backend: node server.js');
            console.log('   2. Start frontend: npm start (in frontend folder)');
            console.log('   3. Go to http://localhost:3000 and register\n');
            process.exit(0);
        }

        console.log('\nUsers:');
        users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.email} (ID: ${user._id})`);
        });

        // Get all mood entries
        const allEntries = await MoodEntry.find().populate('user').populate('emotion');
        console.log(`\n📊 Total mood entries in database: ${allEntries.length}\n`);

        if (allEntries.length === 0) {
            console.log('⚠️  No mood entries found yet.');
            console.log('   To create an entry:');
            console.log('   1. Make sure backend and frontend are running');
            console.log('   2. Login to the app');
            console.log('   3. Go to HomePage and fill out the mood form');
            console.log('   4. Click "Save Entry"\n');
        } else {
            console.log('Mood Entries:');
            console.log('═'.repeat(80));
            allEntries.forEach((entry, index) => {
                console.log(`\n${index + 1}. Entry ID: ${entry._id}`);
                console.log(`   User: ${entry.user?.email || 'Unknown'}`);
                console.log(`   Emotion: ${entry.emotion?.description || 'Unknown'}`);
                console.log(`   Quick Write: "${entry.quick_write?.substring(0, 60)}${entry.quick_write?.length > 60 ? '...' : ''}"`);
                console.log(`   Question Answer: "${entry.question_answer?.substring(0, 60)}${entry.question_answer?.length > 60 ? '...' : ''}"`);
                console.log(`   Created: ${entry.createdAt?.toLocaleString()}`);
            });
            console.log('\n' + '═'.repeat(80));
            console.log('\n✅ Database is working! Entries are being saved successfully!');
        }

        // Group entries by user
        if (allEntries.length > 0) {
            console.log('\n📈 Entries per user:');
            const entriesByUser = {};
            allEntries.forEach(entry => {
                const email = entry.user?.email || 'Unknown';
                entriesByUser[email] = (entriesByUser[email] || 0) + 1;
            });
            Object.entries(entriesByUser).forEach(([email, count]) => {
                console.log(`   ${email}: ${count} ${count === 1 ? 'entry' : 'entries'}`);
            });
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ MongoDB connection closed.');
        process.exit(0);
    }
}

checkEntries();
