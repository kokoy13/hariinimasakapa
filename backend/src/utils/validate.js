function validateIngredients(ingredients) {
  if (!Array.isArray(ingredients)) {
    const err = new Error('Field "ingredients" harus berupa array.');
    err.status = 400;
    err.expose = true;
    throw err;
  }

  const normalized = ingredients
    .map((x) => String(x || '').trim())
    .filter(Boolean)
    .slice(0, 25);

  if (normalized.length === 0) {
    const err = new Error(
      'Isi dulu bahan-bahannya ya (pisahkan dengan koma).',
    );
    err.status = 400;
    err.expose = true;
    throw err;
  }

  return normalized;
}

function isWeirdIngredients(ingredients) {
  const weird = new Set([
    'batu',
    'kayu',
    'pasir',
    'tanah',
    'besi',
    'bensin',
    'solar',
    'oli',
    'plastik',
    'kertas',
    'sabun',
    'deterjen',
    'racun',
  ]);

  return ingredients.some((i) => weird.has(i.toLowerCase()));
}

module.exports = { validateIngredients, isWeirdIngredients };

