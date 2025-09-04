/**
 * @file routes/index.js
 * @description Default Express scaffolded route (unused by assignment).
 * @module routes/index
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
