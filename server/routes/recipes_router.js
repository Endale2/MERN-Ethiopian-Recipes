import express from 'express';
import RecipeModel from '../models/Recipe.js';
import { upload } from '../config/mutler.js';
import supabase from '../config/supabaseClient.js';

export const recipesRouter = express.Router();

// Auth middleware
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not authorized' });
};

// Create recipe with image upload
recipesRouter.post(
  '/',
  ensureAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Image is required.' });
      }

      // 1) Build a unique path in your bucket
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random()*1e9)}.${fileExt}`;
      const filePath = `recipes/${fileName}`;

      // 2) Upload buffer to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('recipes')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return res.status(500).json({ message: 'Image upload failed.' });
      }

      // 3) Generate a public URL
      const { publicURL, error: urlError } = supabase
        .storage
        .from('recipes')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Supabase URL error:', urlError);
        return res.status(500).json({ message: 'Could not get image URL.' });
      }

      // 4) Save recipe with Supabase URL
      const recipeData = {
        ...req.body,
        imageURL: publicURL,
        userOwner: req.user.id
      };

      const newRecipe = new RecipeModel(recipeData);
      await newRecipe.save();

      res.status(201).json(newRecipe);
    } catch (err) {
      console.error('Error creating recipe:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);


// Save recipe
recipesRouter.put('/save', ensureAuth, async (req, res) => {
  const user = await import('../models/User.js').then(m => m.default.findById(req.user.id));
  if (!user.savedRecipes.includes(req.body.recipeId)) {
    user.savedRecipes.push(req.body.recipeId);
    await user.save();
  }
  res.json({ savedRecipes: user.savedRecipes });
});

// Get saved recipes
recipesRouter.get('/saved', ensureAuth, async (req, res) => {
  const user = await import('../models/User.js').then(m => m.default.findById(req.user.id).populate('savedRecipes'));
  res.json({ savedRecipes: user.savedRecipes });
});

// Delete saved recipe
recipesRouter.delete('/saved/:recipeId', ensureAuth, async (req, res) => {
  const user = await import('../models/User.js').then(m => m.default.findById(req.user.id));
  user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== req.params.recipeId);
  await user.save();
  res.json({ savedRecipes: user.savedRecipes });
});

// Get single recipe
recipesRouter.get('/:id', async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id).populate('userOwner', 'displayName photoURL');
  if (!recipe) return res.status(404).json({ message: 'Not found' });
  res.json(recipe);
});

// Get all recipes (public)
recipesRouter.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel
      .find({})
      .populate('userOwner', 'displayName photoURL');
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});


