const express = require('express');
const cors = require('cors');
const pino = require('pino');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url });
  next();
});

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

app.use('/api/add', require('./routes/costs'));
app.use('/api/report', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/about', require('./routes/about'));
app.use('/api/logs', require('./routes/logs'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: 'server_error',
    message: err.message || 'Internal Server Error'
  });
});

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
