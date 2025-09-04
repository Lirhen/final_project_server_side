/**
 * @file routes/reports.js
 * @description GET /api/report – returns monthly grouped costs, cached for past months.
 * @module routes/reports
 */
const express = require('express');
const router = express.Router();
const Cost = require('../models/Cost');
const Report = require('../models/Report');

const CATS = ['food','health','housing','sports','education'];

/**
 * GET /api/report
 * @route GET /api/report
 * @group Reports
 * @param {number} id.query.required - User ID
 * @param {number} year.query.required
 * @param {number} month.query.required - 1–12
 * @returns {Report} 200 - Monthly report grouped by category
 * @returns {Error} 400 - Invalid/missing params
 */
router.get('/', async (req, res) => {
    try {
        const userid = Number(req.query.id);
        const year   = Number(req.query.year);
        const month  = Number(req.query.month);

        // Basic query param validation
        if (!userid || !year || !month || month < 1 || month > 12) {
            return res.status(400).json({ error: 'missing_or_invalid_query_params' });
        }

        // Compute date window for the requested month
        const start = new Date(year, month - 1, 1);
        const end   = new Date(year, month, 1);

        // Determine whether this month is in the past, relative to the first day of the current month
        const todayFirstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const isPast = end <= todayFirstOfMonth;

        // Return cached payload for past months (if available)
        if (isPast) {
            const cached = await Report.findOne({ userid, year, month });
            if (cached) return res.json(cached.payload);
        }

        // Query costs for the month and group in-memory by category
        const items = await Cost.find({
            userid,
            date: { $gte: start, $lt: end }
        }, { _id: 0, __v: 0 });

        const byCat = Object.fromEntries(CATS.map(c => [c, []]));
        for (const it of items) {
            byCat[it.category].push({
                sum: it.sum,
                description: it.description,
                day: new Date(it.date).getDate()
            });
        }

        const payload = {
            userid,
            year,
            month,
            costs: CATS.map(c => ({ [c]: byCat[c] }))
        };

        // Cache only for past months
        if (isPast) {
            await Report.findOneAndUpdate(
                { userid, year, month },
                { userid, year, month, payload },
                { upsert: true }
            );
        }

        res.json(payload);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
