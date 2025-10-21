const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MoodEntrySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    emotion: {type: Schema.Types.ObjectId, ref: 'Emotion', required: true},
    quick_write: {type: String, default: ''},
    question_answer: {type: String, default: ''},
    duration: {type: Number, default: 0}, // in seconds, for timed entries
    startTime: {type: Date},
    endTime: {type: Date},
}, {timestamps: true});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);
