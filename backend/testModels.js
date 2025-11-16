require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MoodEntry = require('./models/MoodEntry');

const db_uri = `mongodb+srv://${process.env.db_user}:${encodeURIComponent(process.env.db_pass)}@vidgame-proj.7oy2xv8.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;

mongoose.connect(db_uri)
  .then(async () => {
    console.log('MongoDB connected for testing!');

    // Test creating a User
    const user = new User({ username: 'bella', password: 'hashedpassword' });
    await user.save();
    console.log('User saved:', user);

    // Test creating a MoodEntry
    const entry = new MoodEntry({
      user: user._id,
      emotion: 'happy',
      journal: 'Feeling great today!'
    });
    await entry.save();
    console.log('MoodEntry saved:', entry);

    // Test fetching entries
    const entries = await MoodEntry.find({ user: user._id });
    console.log('Entries found:', entries);

    // Cleanup (optional)
    await User.deleteOne({ _id: user._id });
    await MoodEntry.deleteMany({ user: user._id });

    mongoose.disconnect();
  })
  .catch(err => console.error('MongoDB connection error:', err));
