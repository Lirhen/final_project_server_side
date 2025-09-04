/**
 * routes/costs.js
 * POST /api/add – branch #2: add a cost item when cost-shaped body is sent.
 *
 * Behavior
 * - If body contains { userid, description, category, sum } => create cost
 * - Allowed categories enforced by whitelist
 * - If a future date is provided, it is accepted; past date is rejected
 * (assignment requirement: "server side doesn’t allow adding costs with dates that belong to the past")
 */
const express = require('express');
const router = express.Router();
const Cost = require('../models/Cost');

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