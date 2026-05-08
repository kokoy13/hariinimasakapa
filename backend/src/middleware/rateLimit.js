const rateLimit = require('express-rate-limit');

const windowMs =
  Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000;
const max = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 40);

const apiLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error:
      'Terlalu banyak permintaan. Coba lagi beberapa saat ya (untuk menjaga API tetap aman).',
  },
});

module.exports = { apiLimiter };

