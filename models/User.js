/**
 * @file models/User.js
 * @description User schema per assignment spec (numeric id, names, birthday).
 * @module models/User
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    birthday: {type: Date, required: true}
});

module.exports = mongoose.model('User', UserSchema);