/*
 * routes/reports.js
 * GET /api/report?id=ID&year=YYYY&month=M
 *
 * Computed Design Pattern:
 *  - For past months: compute report once and cache in DB
 *  - For current/future: compute on the fly (no caching)
 */
const express = require('express');
const router = express.Router();
const Cost = require('../models/Cost');
const Report = require('../models/Report');

const CATS = ['food','health','housing','sports','education'];

// GET /api/report
router.get('/', async (req, res) => {
    try {
        const userid = Number(req.query.id);
        const year   = Number(req.query.year);
        const month  = Number(req.query.month);

        // Validate params
        if (!userid || !year || !month || month < 1 || month > 12) {
            return res.status(400).json({ error: 'missing_or_invalid_query_params' });
        }

        // Define date window
        const start = new Date(year, month - 1, 1);
        const end   = new Date(year, month, 1);

        // Check if past month
        const todayFirstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const isPast = end <= todayFirstOfMonth;

        // Return cached if exists
        if (isPast) {
            const cached = await Report.findOne({ userid, year, month });
            if (cached) return res.json(cached.payload);
        }

        // Query costs
        const items = await Cost.find({
            userid,
            date: { $gte: start, $lt: end }
        }, { _id: 0, __v: 0 });

        // Group by categories
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

        // Cache if past
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
