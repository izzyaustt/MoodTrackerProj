//this file just to test the models and debig
//it inserts a random user and mood entry
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MoodEntry = require('./models/MoodEntry'); 

const db_uri = `mongodb+srv://${process.env.db_user}:${encodeURIComponent(process.env.db_pass)}@vidgame-proj.7oy2xv8.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;


mongoose.connect(db_uri)
  .then(async () => {
    console.log('MongoDB connected for testing!');

    // unique test user to avoid dups
    const testUsername = `testUser_${Date.now()}`;

    try {
      // making test user
      const user = new User({ username: testUsername, password: 'hashedpassword' });
      await user.save();
      console.log('User saved:', user);

      // test entry
      const entry = new MoodEntry({
        user: user._id,
        emotion: 'happy',
        journal: 'Feeling great today!'
      });
      await entry.save();
      console.log('MoodEntry saved:', entry);

      // getting entries from user
      const entries = await MoodEntry.find({ user: user._id });
      console.log('Entries found:', entries);

      // delete test data
      await User.deleteOne({ _id: user._id });
      await MoodEntry.deleteMany({ user: user._id });

      console.log('Test data cleaned up.');
    } catch (err) {
      console.error('Error during testing:', err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));
