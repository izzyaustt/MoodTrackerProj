//eslint-disable
require('dotenv').config();
console.log('Mongo URI:', process.env.db_uri);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const db_uri = `mongodb+srv://${process.env.db_user}:${encodeURIComponent(process.env.db_pass)}@vidgame-proj.7oy2xv8.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: db_uri }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

//mongodb connection
mongoose.connect(db_uri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const apiRoutes = require('./routes/api');

app.use('/auth', authRoutes);
app.use('/mood', moodRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.send('Hello backend!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));