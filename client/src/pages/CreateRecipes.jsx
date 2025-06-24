import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaPenFancy, FaList, FaClock, FaImage, FaPlus, FaBookOpen, FaTimesCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateRecipes() {
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [""],
    instruction: "",
    cookingTime: 0,
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setRecipe(r => ({ ...r, [name]: value }));
  };

  const handleIngredientChange = (i, e) => {
    const arr = [...recipe.ingredients];
    arr[i] = e.target.value;
    setRecipe(r => ({ ...r, ingredients: arr }));
  };

  const addIngredient = () =>
    setRecipe(r => ({ ...r, ingredients: [...r.ingredients, ""] }));

  const removeIngredient = (indexToRemove) => {
    setRecipe(r => ({
      ...r,
      ingredients: r.ingredients.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an image for your recipe!");
      return;
    }

    // Filter out empty ingredient fields before sending to avoid sending empty strings
    const filteredIngredients = recipe.ingredients.filter(ing => ing.trim() !== '');
    if (filteredIngredients.length === 0) {
      toast.error("Please add at least one ingredient.");
      return;
    }

    setIsSubmitting(true); // Start loading

    const form = new FormData();
    form.append('name', recipe.name);
    form.append('description', recipe.description);
    form.append('instruction', recipe.instruction);
    form.append('cookingTime', recipe.cookingTime);
    filteredIngredients.forEach(ing => form.append('ingredients', ing));
    form.append('image', file);

    try {
      await api.post('/recipes', form);
      toast.success("Recipe created successfully!");
      navigate('/'); // Redirect to the homepage after successful creation
    } catch (err) {
      console.error("Error creating recipe:", err);
      toast.error(err.response?.data?.message || err.message || "An error occurred while creating the recipe.");
    } finally {
      setIsSubmitting(false); // End loading regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-500 mb-4"></div>
            <p className="text-white text-xl font-semibold">Creating your recipe...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg md:max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-orange-800 mb-12 drop-shadow-md font-playfair-display animate-fade-in-down flex items-center justify-center">
          <FaUtensils className="text-orange-600 mr-4 text-5xl md:text-6xl" /> Create Your Recipe
        </h1>

        <form onSubmit={handleSubmit}
          className={`bg-white p-10 rounded-3xl shadow-2xl w-full space-y-7 border border-gray-100 relative z-10 animate-fade-in-up ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}> {/* Apply opacity and disable interaction when submitting */}

          {/* Recipe Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-gray-700 font-semibold text-base md:text-lg">
              <FaPenFancy className="inline-block mr-2 text-orange-500" /> Recipe Name
            </label>
            <input
              id="name"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              required
              placeholder="e.g., Doro Wat"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ease-in-out"
              disabled={isSubmitting} // Disable during submission
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 text-gray-700 font-semibold text-base md:text-lg">
              <FaBookOpen className="inline-block mr-2 text-orange-500" /> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={recipe.description}
              onChange={handleChange}
              rows={3}
              required
              placeholder="A rich, spicy chicken stew..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ease-in-out resize-y"
              disabled={isSubmitting} // Disable during submission
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block mb-3 text-gray-700 font-semibold text-base md:text-lg">
              <FaList className="inline-block mr-2 text-orange-500" /> Ingredients
            </label>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center mb-3">
                <input
                  value={ing}
                  onChange={e => handleIngredientChange(i, e)}
                  placeholder={`Ingredient ${i + 1}`}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ease-in-out"
                  required
                  disabled={isSubmitting} // Disable during submission
                />
                {recipe.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="ml-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                    aria-label={`Remove ingredient ${i + 1}`}
                    disabled={isSubmitting} // Disable during submission
                  >
                    <FaTimesCircle size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="inline-flex items-center mt-2 px-5 py-2 bg-orange-50 text-orange-600 rounded-full font-medium hover:bg-orange-100 hover:text-orange-700 transition-colors duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.01]"
              disabled={isSubmitting} // Disable during submission
            >
              <FaPlus className="mr-2" /> Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instruction" className="block mb-2 text-gray-700 font-semibold text-base md:text-lg">
              <FaBookOpen className="inline-block mr-2 text-orange-500" /> Instructions
            </label>
            <textarea
              id="instruction"
              name="instruction"
              value={recipe.instruction}
              onChange={handleChange}
              rows={6}
              required
              placeholder="Step-by-step cooking guide..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ease-in-out resize-y"
              disabled={isSubmitting} // Disable during submission
            />
          </div>

          {/* Cooking Time */}
          <div>
            <label htmlFor="cookingTime" className="block mb-2 text-gray-700 font-semibold text-base md:text-lg">
              <FaClock className="inline-block mr-2 text-orange-500" /> Cooking Time (minutes)
            </label>
            <input
              id="cookingTime"
              type="number"
              name="cookingTime"
              value={recipe.cookingTime}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g., 60"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ease-in-out"
              disabled={isSubmitting} // Disable during submission
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="imageUpload" className="block mb-2 text-gray-700 font-semibold text-base md:text-lg">
              <FaImage className="inline-block mr-2 text-orange-500" /> Recipe Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              required
              className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200
                         transition-all duration-200 cursor-pointer"
              disabled={isSubmitting} // Disable during submission
            />
            {file && <p className="text-sm text-gray-500 mt-2">Selected file: <span className="font-medium text-gray-700">{file.name}</span></p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3.5 rounded-full font-bold text-xl shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.005]"
            disabled={isSubmitting} // Disable during submission
          >
            {isSubmitting ? 'Creating...' : 'Create Recipe'} {/* Change button text during submission */}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}