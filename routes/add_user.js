/**
 * routes/add_user.js
 * POST /api/add – branch #1: create a user when user-shaped body is sent.
 *
 * Behavior
 * - If body contains { id, first_name, last_name, birthday } => create user
 * - Otherwise, pass to next middleware (costs route mounted on same path)
 *
 * Validation
 * - All fields required and non-empty
 * - id must be an integer Number
 * - birthday must parse to a valid Date
 * - Duplicate id returns 409 { error: 'id_exists' }
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res, next) => {
    const { id, first_name, last_name, birthday } = req.body || {};

    // If the body is not user-shaped, delegate to next route (/api/add costs)
    if ([id, first_name, last_name, birthday].some(v => v === undefined)) return next();

    try {
        // Basic field presence + trim checks
        if (String(id).trim() === '' || String(first_name).trim() === '' ||
            String(last_name).trim() === '' || String(birthday).trim() === '') {
            return res.status(400).json({ error: 'missing_fields' });
        }

        const idNum = Number(id);
        if (!Number.isInteger(idNum)) return res.status(400).json({ error: 'id_not_number' });

        const bday = new Date(birthday);
        if (Number.isNaN(bday.getTime())) return res.status(400).json({ error: 'invalid_birthday' });

        const user = await User.create({
            id: idNum,
            first_name: String(first_name),
            last_name: String(last_name),
            birthday: bday
        });

        return res.json({ id: user.id, first_name: user.first_name, last_name: user.last_name, birthday: user.birthday });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: 'id_exists' });
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
