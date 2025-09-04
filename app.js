/**
 * @file app.js
 * @description Express application configuration for the Cost Manager REST API.
 * @requires express
 * @requires cors
 * @requires pino
 * @requires dotenv
 * @requires mongoose
 * @module app
 */
const express = require('express');
const cors = require('cors');
const pino = require('pino');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

// Parse CORS + JSON
app.use(cors());
app.use(express.json());

// Console log every request (method + url)
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url });
  next();
});

// Persist a log document for every request when response finishes
const Log = require('./models/Log');

app.use(async (req, res, next) => {
  res.on('finish', async () => {
    try {
      await Log.create({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
      });
    } catch (err) {
      logger.error(err);
    }
  });
  next();
});

// Route mounting. Note that /api/add handles both user creation and cost creation
// depending on the JSON body shape (see routes/add_user.js and routes/costs.js)
app.use('/api/add', require('./routes/add_user'));
app.use('/api/add', require('./routes/costs'));
app.use('/api/report', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/about', require('./routes/about'));
app.use('/api/logs', require('./routes/logs'));

// Health endpoint for uptime monitors and quick checks
app.get('/health', (req, res) => res.json({ ok: true }));

// Fallback 404 in JSON (kept last to avoid intercepting real routes)
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Endpoint not found' });
});

// Centralized error handler – always returns JSON
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: 'server_error',
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB in non-test environments. Tests use in-memory server.
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.MONGO_URI) {
    logger.error('MONGO_URI is missing in .env');
  } else {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => logger.info('MongoDB connected'))
        .catch((e) => {
          logger.error(e);
          process.exit(1);
        });
  }
}

module.exports = app;
