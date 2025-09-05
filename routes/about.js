/*
 * routes/about.js
 * Returns static team information as required by the assignment.
 */
const express = require('express');
const router = express.Router();

// GET /api/about
router.get('/', (req, res) => {
    res.json([
        { first_name: 'lir', last_name: 'chen' },
        { first_name: 'alexander', last_name: 'nuriev' }
    ]);
});

module.exports = router;
