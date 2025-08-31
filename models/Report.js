const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userid: Number,
    year: Number,
    month: Number,
    payload: Object
}, { timestamps: true, collection: 'reports_cache' });

module.exports = mongoose.model('Report', ReportSchema);