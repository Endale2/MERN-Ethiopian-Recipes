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
  FaSpinner
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
    if (!file) {
      toast.error('Please select an image for your recipe!');
      return;
    }

    const filteredIngredients = recipe.ingredients.filter(i => i.trim() !== '');
    if (filteredIngredients.length === 0) {
      toast.error('Please add at least one ingredient.');
      return;
    }
    if (recipe.cookingTime <= 0) {
      toast.error('Cooking time must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', recipe.name);
    formData.append('description', recipe.description);
    formData.append('instruction', recipe.instruction);
    formData.append('cookingTime', recipe.cookingTime);
    filteredIngredients.forEach(ing => formData.append('ingredients', ing));
    formData.append('image', file);

    try {
      await api.post('/recipes', formData);
      toast.success('🎉 Recipe created! Redirecting...', { autoClose: 2000 });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      toast.error(`Error: ${msg}`, { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-orange-200 rounded-full opacity-30 filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full opacity-30 filter blur-3xl animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-orange-800 mb-8 flex items-center justify-center space-x-2">
          <FaUtensils className="text-orange-600 text-3xl md:text-4xl" />
          <span>Share Your Recipe</span>
        </h1>

        {/* Submission Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <FaSpinner className="animate-spin text-4xl text-orange-600 mb-4" />
              <p className="text-xl font-semibold mb-2">Creating your recipe...</p>
              <p className="text-gray-600">Just a moment please.</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-xl space-y-6 opacity-100 transition-opacity duration-300"
        >
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              <FaPenFancy className="inline-block mr-2 text-orange-500" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              placeholder="e.g., Misir Wot"
              required
              disabled={isSubmitting}
              className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              <FaBookOpen className="inline-block mr-2 text-orange-500" /> Description
            </label>
            <textarea
              name="description"
              value={recipe.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description"
              required
              disabled={isSubmitting}
              className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition resize-none"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              <FaList className="inline-block mr-2 text-orange-500" /> Ingredients
            </label>
            <div className="space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ing}
                    onChange={e => handleIngredientChange(idx, e)}
                    placeholder={`Ingredient ${idx + 1}`}
                    required
                    disabled={isSubmitting}
                    className="flex-1 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition"
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(idx)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTimesCircle size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              disabled={isSubmitting}
              className="inline-flex items-center mt-4 space-x-2 text-orange-600 hover:text-orange-800"
            >
              <FaPlus />
              <span>Add Ingredient</span>
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              <FaBookOpen className="inline-block mr-2 text-orange-500" /> Instructions
            </label>
            <textarea
              name="instruction"
              value={recipe.instruction}
              onChange={handleChange}
              rows={5}
              placeholder="Step-by-step instructions"
              required
              disabled={isSubmitting}
              className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition resize-none"
            />
          </div>

          {/* Cooking Time & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                <FaClock className="inline-block mr-2 text-orange-500" /> Cooking Time (mins)
              </label>
              <input
                type="number"
                name="cookingTime"
                value={recipe.cookingTime}
                onChange={handleChange}
                min="1"
                required
                disabled={isSubmitting}
                className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                <FaImage className="inline-block mr-2 text-orange-500" /> Recipe Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                required
                disabled={isSubmitting}
                className="w-full text-gray-700 file:rounded-full file:bg-orange-100 file:text-orange-600 file:px-4 file:py-2 hover:file:bg-orange-200 transition"
              />
              {file && <p className="text-sm text-gray-600 mt-1">Selected: {file.name}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-full font-bold shadow hover:from-orange-700 hover:to-amber-700 transition"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" /> Creating...
              </span>
            ) : (
              'Create Recipe'
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}
