import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  FaUtensils,
  FaPenFancy,
  FaList,
  FaClock,
  FaImage,
  FaPlus,
  FaBookOpen,
  FaTimesCircle,
  FaSpinner,
  FaCloudUploadAlt,
  FaLeaf
} from 'react-icons/fa';
import { GiCookingPot, GiKnifeFork } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateRecipes() {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    ingredients: [''],
    instruction: '',
    cookingTime: 0
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = e.target.value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = index => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Basic client-side validation
    if (!recipe.name.trim()) {
      toast.error('Recipe name is required.');
      return;
    }
    if (!recipe.description.trim()) {
      toast.error('Description is required.');
      return;
    }
    if (!recipe.instruction.trim()) {
      toast.error('Instructions are required.');
      return;
    }
    if (recipe.cookingTime <= 0) {
      toast.error('Cooking time must be greater than zero.');
      return;
    }
    if (!file) {
      toast.error('Please select an image for your recipe!');
      return;
    }

    const filteredIngredients = recipe.ingredients.filter(i => i.trim() !== '');
    if (filteredIngredients.length === 0) {
      toast.error('Please add at least one ingredient.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', recipe.name.trim());
    formData.append('description', recipe.description.trim());
    formData.append('instruction', recipe.instruction.trim());
    formData.append('cookingTime', recipe.cookingTime);
    filteredIngredients.forEach(ing => formData.append('ingredients', ing.trim()));
    formData.append('image', file);

    try {
      await api.post('/recipes', formData);
      toast.success('🎉 Recipe created successfully! Redirecting to homepage...', { autoClose: 2500 });
      setTimeout(() => navigate('/'), 2500); // Give user a moment to see the toast
    } catch (err) {
      console.error('Recipe creation error:', err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
      toast.error(`❌ ${errorMessage}`, { autoClose: 5000 }); // Longer autoClose for errors
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ethiopian-50 via-white to-spice-50">
      {/* Header Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-ethiopian-100 text-ethiopian-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaUtensils className="text-spice-500" />
                <span>Share Your Recipe</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient mb-6">
                Share Your Ethiopian Recipe
              </h1>
              <p className="text-xl text-earth-600 max-w-2xl mx-auto">
                Contribute to our community by sharing your favorite Ethiopian dishes and helping others discover authentic flavors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-white/50 backdrop-blur-sm">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            {/* Submission Overlay */}
            {isSubmitting && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="glass-effect rounded-2xl p-8 text-center animate-scale-in">
                  <div className="relative mb-6">
                    <GiCookingPot className="text-6xl text-ethiopian-500 animate-bounce-gentle" />
                    <GiKnifeFork className="absolute -top-2 -right-2 text-2xl text-spice-500 animate-float" />
                  </div>
                  <h3 className="text-2xl font-bold text-earth-800 mb-3">Crafting Your Recipe</h3>
                  <p className="text-earth-600">Please wait while we prepare your dish for the world!</p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className={`card p-8 md:p-10 space-y-8 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-earth-800 font-semibold mb-3 flex items-center">
                  <FaPenFancy className="mr-3 text-ethiopian-500 text-xl" />
                  Recipe Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={recipe.name}
                  onChange={handleChange}
                  placeholder="e.g., Authentic Doro Wot"
                  required
                  disabled={isSubmitting}
                  className="w-full border border-earth-200 rounded-xl px-5 py-4 text-lg text-earth-800 placeholder-earth-400 focus:ring-2 focus:ring-ethiopian-400 focus:border-ethiopian-500 transition-all duration-300 shadow-soft"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-earth-800 font-semibold mb-3 flex items-center">
                  <FaBookOpen className="mr-3 text-ethiopian-500 text-xl" />
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={recipe.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="A rich, flavorful Ethiopian chicken stew with hard-boiled eggs, simmered in aromatic spices and served with injera."
                  required
                  disabled={isSubmitting}
                  className="w-full border border-earth-200 rounded-xl px-5 py-4 text-lg text-earth-800 placeholder-earth-400 focus:ring-2 focus:ring-ethiopian-400 focus:border-ethiopian-500 transition-all duration-300 resize-y shadow-soft"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-earth-800 font-semibold mb-4 flex items-center">
                  <FaList className="mr-3 text-ethiopian-500 text-xl" />
                  Ingredients
                </label>
                <div className="space-y-4">
                  {recipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={ing}
                        onChange={e => handleIngredientChange(idx, e)}
                        placeholder={`e.g., 1 large red onion, finely chopped`}
                        required
                        disabled={isSubmitting}
                        className="flex-1 border border-earth-200 rounded-xl px-5 py-4 text-lg text-earth-800 placeholder-earth-400 focus:ring-2 focus:ring-ethiopian-400 focus:border-ethiopian-500 transition-all duration-300 shadow-soft"
                      />
                      {recipe.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          disabled={isSubmitting}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-3 rounded-xl hover:bg-red-50"
                          aria-label={`Remove ingredient ${idx + 1}`}
                        >
                          <FaTimesCircle size={24} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  disabled={isSubmitting}
                  className="inline-flex items-center mt-6 px-6 py-3 bg-ethiopian-100 text-ethiopian-700 rounded-xl font-semibold hover:bg-ethiopian-200 hover:text-ethiopian-800 transition-all duration-300 shadow-soft hover:shadow-medium"
                >
                  <FaPlus className="mr-2 text-lg" />
                  Add Another Ingredient
                </button>
              </div>

              {/* Instructions */}
              <div>
                <label htmlFor="instruction" className="block text-earth-800 font-semibold mb-3 flex items-center">
                  <FaBookOpen className="mr-3 text-ethiopian-500 text-xl" />
                  Instructions
                </label>
                <textarea
                  id="instruction"
                  name="instruction"
                  value={recipe.instruction}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Start by sautéing onions until caramelized. Add berbere and cook for a few minutes to release the flavors..."
                  required
                  disabled={isSubmitting}
                  className="w-full border border-earth-200 rounded-xl px-5 py-4 text-lg text-earth-800 placeholder-earth-400 focus:ring-2 focus:ring-ethiopian-400 focus:border-ethiopian-500 transition-all duration-300 resize-y shadow-soft"
                />
              </div>

              {/* Cooking Time & Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="cookingTime" className="block text-earth-800 font-semibold mb-3 flex items-center">
                    <FaClock className="mr-3 text-ethiopian-500 text-xl" />
                    Cooking Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="cookingTime"
                    name="cookingTime"
                    value={recipe.cookingTime}
                    onChange={handleChange}
                    min="1"
                    required
                    disabled={isSubmitting}
                    placeholder="e.g., 60"
                    className="w-full border border-earth-200 rounded-xl px-5 py-4 text-lg text-earth-800 placeholder-earth-400 focus:ring-2 focus:ring-ethiopian-400 focus:border-ethiopian-500 transition-all duration-300 shadow-soft"
                  />
                </div>
                <div>
                  <label htmlFor="imageUpload" className="block text-earth-800 font-semibold mb-3 flex items-center">
                    <FaImage className="mr-3 text-ethiopian-500 text-xl" />
                    Recipe Image
                  </label>
                  <div className="relative border border-earth-200 rounded-xl p-4 flex items-center justify-between shadow-soft focus-within:ring-2 focus-within:ring-ethiopian-400 focus-within:border-ethiopian-500 transition-all duration-300">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={e => setFile(e.target.files[0])}
                      required
                      disabled={isSubmitting}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <span className="text-earth-700 text-base flex-1 pr-2 truncate">
                      {file ? file.name : 'Choose an image'}
                    </span>
                    <button
                      type="button"
                      onClick={() => document.getElementById('imageUpload').click()}
                      disabled={isSubmitting}
                      className="bg-ethiopian-100 text-ethiopian-600 px-4 py-2 rounded-xl font-semibold hover:bg-ethiopian-200 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <FaCloudUploadAlt className="text-xl" />
                      <span>Browse</span>
                    </button>
                  </div>
                  {file && (
                    <p className="text-sm text-earth-600 mt-2">
                      Selected: <span className="font-medium text-earth-700">{file.name}</span>
                    </p>
                  )}
                  {!file && (
                    <p className="text-sm text-earth-500 mt-2">JPG, PNG, or GIF recommended.</p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-xl py-4 flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-2xl" />
                    <span>Creating Recipe...</span>
                  </>
                ) : (
                  <>
                    <GiCookingPot className="text-2xl" />
                    <span>Create Recipe</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}