import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaList, FaClock, FaImage, FaPlus } from 'react-icons/fa';

export default function CreateRecipes() {
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [""],
    instruction: "",
    cookingTime: 0,
  });
  const [file, setFile] = useState(null);
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return alert("Please select an image.");

    const form = new FormData();
    form.append('name', recipe.name);
    form.append('description', recipe.description);
    form.append('instruction', recipe.instruction);
    form.append('cookingTime', recipe.cookingTime);
    recipe.ingredients.forEach(ing => form.append('ingredients', ing));
    form.append('image', file);

    try {
      await api.post('/recipes', form);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-extrabold text-orange-700 mb-8 flex items-center">
        <FaUtensils className="text-orange-500 mr-2" /> Create Your Recipe
      </h1>

      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">

        {/* Name */}
        <div>
          <label className="block mb-2 font-semibold"><FaList className="inline mr-1"/>Name</label>
          <input name="name" value={recipe.name} onChange={handleChange} required
            className="w-full border px-3 py-2 rounded-md" />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold"><FaList className="inline mr-1"/>Description</label>
          <input name="description" value={recipe.description} onChange={handleChange} required
            className="w-full border px-3 py-2 rounded-md" />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block mb-2 font-semibold"><FaList className="inline mr-1"/>Ingredients</label>
          {recipe.ingredients.map((ing, i) => (
            <input key={i} value={ing}
              onChange={e => handleIngredientChange(i, e)}
              className="w-full mb-2 border px-3 py-2 rounded-md"
              required />
          ))}
          <button type="button" onClick={addIngredient}
            className="flex items-center text-orange-500 hover:underline">
            <FaPlus className="mr-1"/> Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="block mb-2 font-semibold"><FaList className="inline mr-1"/>Instructions</label>
          <textarea name="instruction" value={recipe.instruction} onChange={handleChange}
            rows={4} required className="w-full border px-3 py-2 rounded-md" />
        </div>

        {/* Cooking Time */}
        <div>
          <label className="block mb-2 font-semibold"><FaClock className="inline mr-1"/>Cooking Time (min)</label>
          <input type="number" name="cookingTime" value={recipe.cookingTime}
            onChange={handleChange} required className="w-full border px-3 py-2 rounded-md" />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-2 font-semibold"><FaImage className="inline mr-1"/>Image</label>
          <input type="file" accept="image/*"
            onChange={e => setFile(e.target.files[0])}
            required className="w-full" />
        </div>

        <button type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600">
          Create Recipe
        </button>
      </form>
    </div>
  );
}
