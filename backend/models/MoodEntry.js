//storing mood entries from the 3 minute writing thing
//schemas are used in mongoose for validation and consistency, which is why i used them
//i think it also makes the structure easier
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', reqired: true},
    date: {type: Date, default: Date.now},
    emotion: {type: String, required: true},
    journal: {type: String}, 
}, {timestamps:true});

module.exports=mongoose.model('MoodEntry',EntrySchema);