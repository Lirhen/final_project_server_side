/**
 * models/Report.js
 * Cached monthly reports (Computed Design Pattern).
 *
 * Notes
 * - For past months we compute once and upsert here for quick future reads
 * - Collection name fixed to 'reports_cache' for clarity
 */
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userid: Number,
    year: Number,
    month: Number,
    payload: Object
}, { timestamps: true, collection: 'reports_cache' });

module.exports = mongoose.model('Report', ReportSchema);