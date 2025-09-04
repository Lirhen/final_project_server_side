/**
 * models/Log.js
 * Persists minimal request log record for each HTTP request.
 * Saved via middleware in app.js when response finishes.
 */
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    method: String,
    url: String,
    status: Number,
    timestamp: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Log', LogSchema);