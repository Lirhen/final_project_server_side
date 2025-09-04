/**
 * @file routes/costs.js
 * @description POST /api/add – creates cost when body contains cost fields.
 * @module routes/costs
 */
const express = require('express');
const router = express.Router();
const Cost = require('../models/Cost');

/**
 * POST /api/add
 * @route POST /api/add
 * @group Costs
 * @param {number} userid.body.required
 * @param {string} description.body.required
 * @param {string} category.body.required - Must be one of food|health|housing|sports|education
 * @param {number} sum.body.required
 * @param {string} [date.body] - Optional, must not be in the past
 * @returns {Cost} 200 - Created cost
 * @returns {Error} 400 - Validation error
 */
router.post('/', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;

        // Required fields for cost creation
        if (description == null || category == null || userid == null || sum == null) {
            return res.status(400).json({ error: 'missing_fields' });
        }

        const ALLOWED = ['food', 'health', 'housing', 'sports', 'education'];
        if (!ALLOWED.includes(String(category))) {
            return res.status(400).json({ error: 'invalid_category' });
        }

        const useridNum = Number(userid);
        const sumNum = Number(sum);
        if (Number.isNaN(useridNum) || Number.isNaN(sumNum)) {
            return res.status(400).json({ error: 'userid_or_sum_not_number' });
        }

        // Reject backdated costs if client tries to push a past date explicitly
        if (date) {
            const d = new Date(date);
            const today = new Date(new Date().toString());
            if (d < today) return res.status(400).json({ error: 'date_in_past_not_allowed' });
        }

        const cost = await Cost.create({
            description: String(description),
            category: String(category),
            userid: useridNum,
            sum: sumNum,
            ...(date ? { date } : {})
        });

        // Respond with persisted fields only
        res.json({
            description: cost.description,
            category: cost.category,
            userid: cost.userid,
            sum: cost.sum,
            date: cost.date
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;