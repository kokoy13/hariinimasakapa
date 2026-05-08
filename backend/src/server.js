const dotenv = require('dotenv');

dotenv.config();

const { createApp } = require('./app');

const PORT = Number(process.env.PORT || 5000);

const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`);
});

