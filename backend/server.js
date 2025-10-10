//eslint-disable
require('dotenv').config();
console.log('Mongo URI:', process.env.db_uri);
const express = require('express'); 
const mongoose = require('mongoose');

const db_uri = `mongodb+srv://${process.env.db_user}:${encodeURIComponent(process.env.db_pass)}@vidgame-proj.7oy2xv8.mongodb.net/${process.env.db_name}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());

//mongodb connection
mongoose.connect(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.send('Hello backend!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));