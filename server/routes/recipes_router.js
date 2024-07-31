import express from "express";
import mongoose from "mongoose";
import RecipeModel from "../models/Recipes.js";
import UserModel from "../models/User.js";

const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (err) {
    res.json(err);
  }
});

// Create a new recipe
router.post("/", async (req, res) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.json(err);
  }
});

// Save a recipe to user's saved recipes
router.put("/", async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
});


// Get the current user's saved recipes
router.get("/saved-recipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).populate('savedRecipes');
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});


export { router as recipesRouter };


