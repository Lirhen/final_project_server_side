/**
 * @file routes/about.js
 * @description GET /api/about – returns team members (first_name, last_name only).
 * @module routes/about
 */
const express = require('express');
const router = express.Router();

/**
 * GET /api/about
 * @route GET /api/about
 * @group About
 * @returns {Array.<object>} 200 - Team members
 */
router.get('/', (req, res) => {
    res.json([
        { first_name: 'lir', last_name: 'chen' },
        { first_name: 'alexander', last_name: 'nuriev' }
    ]);
});

module.exports = router;
