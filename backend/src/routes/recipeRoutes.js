const express = require('express');
const {
  generateRecipe,
  getRecipeById,
  streamGenerateRecipe,
} = require('../controllers/recipeController');

const router = express.Router();

router.post('/generate-recipe', generateRecipe);
router.post('/generate-recipe/stream', streamGenerateRecipe);
router.get('/recipe/:id', getRecipeById);

module.exports = router;

