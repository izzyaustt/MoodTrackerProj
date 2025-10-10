//mongodb stores socuments in collections
//here, i think using two models will make life easier (i hope)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);