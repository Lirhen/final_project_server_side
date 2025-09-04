/**
 * @file routes/users.js
 * @description Routes for user management.
 * @module routes/users
 */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cost = require('../models/Cost');

/**
 * GET /api/users
 * @route GET /api/users
 * @group Users
 * @returns {Array.<User>} 200 - List of users
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, __v: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/users
 * @route POST /api/users
 * @group Users
 * @param {number} id.body.required
 * @param {string} first_name.body.required
 * @param {string} last_name.body.required
 * @param {string} birthday.body.required
 * @returns {User} 200 - Created user
 * @returns {Error} 400 - Validation error
 * @returns {Error} 409 - ID exists
 */
router.post('/', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday } = req.body;

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

/**
 * GET /api/users/:id
 * @route GET /api/users/:id
 * @group Users
 * @param {number} id.path.required
 * @returns {object} 200 - {first_name,last_name,id,total}
 * @returns {Error} 404 - User not found
 */
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await User.findOne({ id }, { _id: 0, __v: 0 });
        if (!user) return res.status(404).json({ error: 'user_not_found' });

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
