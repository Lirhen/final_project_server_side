/*
 * models/Report.js
 * Implements the Computed Design Pattern:
 *  - Past months’ reports are computed once and cached here
 *  - Queries for those months reuse the cached result
 */
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userid: Number,
    year: Number,
    month: Number,
    payload: Object
}, { timestamps: true, collection: 'reports_cache' });

module.exports = mongoose.model('Report', ReportSchema);