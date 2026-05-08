const crypto = require('crypto');
const { recipeCache } = require('../cache/recipeCache');
const {
  generateRecipeFromIngredients,
  streamRecipeFromIngredients,
} = require('../services/geminiService');
const { validateIngredients, isWeirdIngredients } = require('../utils/validate');

async function generateRecipe(req, res, next) {
  try {
    const { ingredients } = req.body || {};
    const normalized = validateIngredients(ingredients);

    if (isWeirdIngredients(normalized)) {
      return res.status(400).json({
        error:
          'Bahan yang kamu masukkan terlalu aneh (misal: batu/kayu). Coba tulis bahan makanan ya.',
      });
    }

    const recipe = await generateRecipeFromIngredients(normalized);

    const id = crypto.randomUUID();
    recipeCache.set(id, recipe);

    return res.status(200).json({ id, recipe });
  } catch (err) {
    return next(err);
  }
}

function getRecipeById(req, res) {
  const id = String(req.params.id || '');
  const recipe = recipeCache.get(id);
  if (!recipe) {
    return res
      .status(404)
      .json({ error: 'Resep tidak ditemukan atau sudah kedaluwarsa.' });
  }
  return res.json({ id, recipe });
}

function sseSend(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function streamGenerateRecipe(req, res, next) {
  try {
    const { ingredients } = req.body || {};
    const normalized = validateIngredients(ingredients);

    if (isWeirdIngredients(normalized)) {
      return res.status(400).json({
        error:
          'Bahan yang kamu masukkan terlalu aneh (misal: batu/kayu). Coba tulis bahan makanan ya.',
      });
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    sseSend(res, 'start', { ok: true });

    const recipe = await streamRecipeFromIngredients(normalized, (delta) => {
      sseSend(res, 'delta', { text: delta });
    });

    const id = crypto.randomUUID();
    recipeCache.set(id, recipe);

    sseSend(res, 'done', { id, recipe });
    res.end();
  } catch (err) {
    // If headers already sent, stream an error event.
    if (res.headersSent) {
      const status = Number(err.status || 500);
      sseSend(res, 'error', {
        status,
        message:
          status === 429
            ? 'Wah, koki kami sedang belanja bahan sebentar!'
            : err.expose
              ? err.message
              : 'Terjadi kesalahan. Coba lagi ya.',
      });
      return res.end();
    }
    return next(err);
  }
}

module.exports = { generateRecipe, getRecipeById, streamGenerateRecipe };

