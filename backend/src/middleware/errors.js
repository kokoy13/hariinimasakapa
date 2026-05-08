function notFound(_req, res, _next) {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const status = Number(err.status || 500);
  const message =
    err.expose && err.message
      ? err.message
      : 'Terjadi kesalahan di server. Coba lagi ya.';

  // eslint-disable-next-line no-console
  console.error(err);

  res.status(status).json({ error: message });
}

module.exports = { errorHandler, notFound };

