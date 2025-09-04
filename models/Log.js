/**
 * @file models/Log.js
 * @description Persists request log record for each HTTP request.
 * @module models/Log
 */
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    method: String,
    url: String,
    status: Number,
    timestamp: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Log', LogSchema);