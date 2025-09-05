/*
 * models/Cost.js
 * Defines schema for costs collection:
 *  - description: String
 *  - category: one of food|health|housing|sports|education
 *  - userid: Number referencing user.id
 *  - sum: Number
 *  - date: defaults to current timestamp
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