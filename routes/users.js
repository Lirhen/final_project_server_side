/*
 * routes/users.js
 * User management endpoints:
 *  - GET all users
 *  - POST new user
 *  - GET user with total costs
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cost = require('../models/Cost');

// GET /api/users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, __v: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users
router.post('/', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday } = req.body;

        // Validate presence
        const fields = [id, first_name, last_name, birthday];
        if (!fields.every(v => v !== undefined && v !== null && String(v).trim() !== '')) {
            return res.status(400).json({ error: 'missing_fields' });
        }

        const idNum = Number(id);
        if (!Number.isInteger(idNum)) {
            return res.status(400).json({ error: 'id_not_number' });
        }

        const bday = new Date(birthday);
        if (Number.isNaN(bday.getTime())) {
            return res.status(400).json({ error: 'invalid_birthday' });
        }

        // Insert new user
        const user = await User.create({
            id: idNum,
            first_name: String(first_name),
            last_name: String(last_name),
            birthday: bday
        });

        res.json({ id: user.id, first_name: user.first_name, last_name: user.last_name, birthday: user.birthday });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: 'id_exists' });
        res.status(400).json({ error: error.message });
    }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await User.findOne({ id }, { _id: 0, __v: 0 });
        if (!user) return res.status(404).json({ error: 'user_not_found' });

        // Aggregate total costs
        const sumAgg = await Cost.aggregate([
            { $match: { userid: id } },
            { $group: { _id: null, total: { $sum: '$sum' } } }
        ]);
        const total = sumAgg.length ? sumAgg[0].total : 0;

        res.json({ first_name: user.first_name, last_name: user.last_name, id, total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
