/**
 * routes/about.js
 * GET /api/about – returns team members (first_name, last_name only).
 * Matches the shape used in users collection, as required by the spec.
 */
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([
        { first_name: 'lir', last_name: 'chen' },
        { first_name: 'alexander', last_name: 'nuriev' }
    ]);
});

module.exports = router;
