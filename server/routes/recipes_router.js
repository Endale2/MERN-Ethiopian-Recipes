import express from 'express';
import mongoose from 'mongoose';
import RecipeModel from '../models/Recipes.js';
import UserModel from '../models/User.js';

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Create a new recipe
router.post('/', async (req, res) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Save a recipe to user's saved recipes
router.put('/', async (req, res) => {
  const { recipeId, userId } = req.body;

  try {
    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedRecipes.push(recipe);
    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error("Error saving recipe:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Get the current user's saved recipes
router.get('/saved-recipes/:userId', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate('savedRecipes');
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error("Error fetching saved recipes:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Delete a saved recipe
router.delete('/saved-recipes/:userId/:recipeId', async (req, res) => {
  const { userId, recipeId } = req.params;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedRecipes = user.savedRecipes.filter(
      (savedRecipeId) => savedRecipeId.toString() !== recipeId
    );
    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error("Error deleting saved recipe:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Get a single recipe by ID with userOwner populated
router.get('/:id', async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id).populate('userOwner');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export { router as recipesRouter };
