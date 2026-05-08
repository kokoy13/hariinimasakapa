const NodeCache = require('node-cache');

const recipeCache = new NodeCache({
  stdTTL: 60 * 30, // 30 minutes
  checkperiod: 60,
  useClones: false,
});

module.exports = { recipeCache };

