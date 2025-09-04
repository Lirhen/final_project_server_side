/**
 * models/User.js
 * User schema per assignment spec (numeric id, names, birthday as Date).
 *
 * Notes
 * - "id" is a unique Number (not ObjectId) to match endpoint contracts
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    birthday: {type: Date, required: true}
});

module.exports = mongoose.model('User', UserSchema);