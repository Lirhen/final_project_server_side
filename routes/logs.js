/**
 * routes/logs.js
 * GET /api/logs – returns last 200 request logs, newest first.
 */
const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

router.get('/', async (req, res) => {
    try {
        const logs = await Log.find({}, { _id: 0, __v: 0 })
            .sort({ timestamp: -1 })
            .limit(200);
        res.json(logs);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
