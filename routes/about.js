const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([
        { first_name: 'lir', last_name: 'chen' },
        { first_name: 'alexander', last_name: 'nuriev' }
    ]);
});

module.exports = router;
