/**
 * models/Cost.js
 * Cost schema with allowed categories and server-generated date.
 *
 * Constraints
 * - category ∈ ['food','health','housing','sports','education']
 * - date defaults to Date.now on server; route blocks backdated inserts
 */
const mongoose = require('mongoose');

const CostSchema = new mongoose.Schema({
    description: {type: String, required: true},
    category: {type: String, required: true,
        enum: ['food', 'health', 'housing', 'sports', 'education'] },
    userid: {type: Number, required: true},
    sum:  {type: Number, required: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Cost', CostSchema);