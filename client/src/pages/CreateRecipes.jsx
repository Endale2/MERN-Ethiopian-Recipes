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
  FaCloudUploadAlt // Added for image upload
} from 'react-icons/fa';
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
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-start overflow-hidden">
      {/* Background Blobs for a modern, fluid feel */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full opacity-30 mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-yellow-300 rounded-full opacity-30 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-52 h-52 bg-red-200 rounded-full opacity-30 mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-2xl"> {/* Increased max-width */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-orange-800 mb-10 drop-shadow-lg font-playfair-display flex items-center justify-center space-x-4">
          <FaUtensils className="text-orange-600 text-4xl md:text-5xl lg:text-6xl" />
          <span>Share Your Recipe</span>
        </h1>

        {/* Submission Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in">
            <div className="bg-white p-10 rounded-xl shadow-2xl text-center flex flex-col items-center animate-scale-in">
              <FaSpinner className="animate-spin text-6xl text-orange-600 mb-6" />
              <p className="text-2xl font-semibold mb-3 text-gray-800">Crafting your culinary masterpiece...</p>
              <p className="text-lg text-gray-600">Please wait a moment while we prepare your dish for the world!</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`bg-white p-8 md:p-10 rounded-3xl shadow-2xl space-y-7 border border-gray-100 transition-opacity duration-300 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2 flex items-center">
              <FaPenFancy className="inline-block mr-3 text-orange-500 text-xl" /> Recipe Name
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
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg text-gray-800 placeholder-gray-400 focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2 flex items-center">
              <FaBookOpen className="inline-block mr-3 text-orange-500 text-xl" /> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={recipe.description}
              onChange={handleChange}
              rows={4}
              placeholder="A rich, flavorful Ethiopian chicken stew with hard-boiled eggs."
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg text-gray-800 placeholder-gray-400 focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 resize-y shadow-sm"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3 flex items-center">
              <FaList className="inline-block mr-3 text-orange-500 text-xl" /> Ingredients
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
                    className="flex-1 border border-gray-300 rounded-xl px-5 py-3 text-lg text-gray-800 placeholder-gray-400 focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 shadow-sm"
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
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
              className="inline-flex items-center mt-5 px-6 py-3 bg-orange-100 text-orange-700 rounded-full font-bold hover:bg-orange-200 hover:text-orange-800 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            >
              <FaPlus className="mr-2 text-lg" /> Add Another Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instruction" className="block text-gray-700 font-semibold mb-2 flex items-center">
              <FaBookOpen className="inline-block mr-3 text-orange-500 text-xl" /> Instructions
            </label>
            <textarea
              id="instruction"
              name="instruction"
              value={recipe.instruction}
              onChange={handleChange}
              rows={6}
              placeholder="Start by sautéing onions until caramelized. Add berbere and cook for a few minutes..."
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg text-gray-800 placeholder-gray-400 focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 resize-y shadow-sm"
            />
          </div>

          {/* Cooking Time & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cookingTime" className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FaClock className="inline-block mr-3 text-orange-500 text-xl" /> Cooking Time (minutes)
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
                className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg text-gray-800 placeholder-gray-400 focus:ring-3 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 shadow-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label htmlFor="imageUpload" className="block text-gray-700 font-semibold mb-2 flex items-center">
                <FaImage className="inline-block mr-3 text-orange-500 text-xl" /> Recipe Image
              </label>
              <div className="relative border border-gray-300 rounded-xl p-3 flex items-center justify-between shadow-sm focus-within:ring-3 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all duration-300">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  required
                  disabled={isSubmitting}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-gray-700 text-base flex-1 pr-2 truncate">
                  {file ? file.name : 'Choose an image'}
                </span>
                <button
                  type="button"
                  onClick={() => document.getElementById('imageUpload').click()}
                  disabled={isSubmitting}
                  className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-semibold hover:bg-orange-200 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FaCloudUploadAlt className="text-xl" />
                  <span>Browse</span>
                </button>
              </div>
              {file && <p className="text-sm text-gray-600 mt-2 ml-1">Selected: <span className="font-medium text-gray-700">{file.name}</span></p>}
              {!file && <p className="text-sm text-gray-500 mt-2 ml-1">JPG, PNG, or GIF recommended.</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 rounded-full font-bold text-xl shadow-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.005] flex items-center justify-center space-x-3"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin text-2xl" /> <span>Creating Recipe...</span>
              </>
            ) : (
              'Create Recipe'
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}