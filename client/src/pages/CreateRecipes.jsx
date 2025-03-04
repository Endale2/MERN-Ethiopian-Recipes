import React, { useState } from 'react';
import axios from 'axios';
import getUserId from '../hooks/getUserId';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaList, FaClock, FaImage, FaPlus } from 'react-icons/fa';

function CreateRecipes() {
  const userId = getUserId();
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [""],
    instruction: "",
    imageURL: "",
    cookingTime: 0,
    userOwner: userId
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/recipes", recipe);
      console.log(response);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = e.target.value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-extrabold text-orange-700 mb-8 flex items-center">
        <FaUtensils className="text-orange-500 mr-2" /> Create Your Recipe
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-800 font-semibold mb-2 flex items-center">
            <FaList className="text-gray-600 mr-2" />
            Recipe Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-800 font-semibold mb-2 flex items-center">
            <FaList className="text-gray-600 mr-2" />
            Recipe Describtion:
          </label>
          <input
            type="text"
            id="describtion"
            name="describtion"
            value={recipe.describtion}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="ingredients" className="block text-gray-800 font-semibold mb-2 flex items-center">
            <FaList className="text-gray-600 mr-2" />
            Ingredients:
          </label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center mt-2 text-orange-500 hover:text-orange-700 font-semibold"
          >
            <FaPlus className="mr-1" /> Add Ingredient
          </button>
        </div>
        <div className="mb-6">
          <label htmlFor="instruction" className="block text-gray-800 font-semibold mb-2 flex items-center">
            <FaList className="text-gray-600 mr-2" />
            Instructions:
          </label>
          <textarea
            id="instruction"
            name="instruction"
            value={recipe.instruction}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-6">
          <label htmlFor="imageURL" className="block text-gray-800 font-semibold mb-2 flex items-center">
            <FaImage className="text-gray-600 mr-2" />
            Image URL:
          </label>
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            value={recipe.imageURL}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="cookingTime" className="block text-gray-800 font-semibold mb-2 flex items-center">
            <FaClock className="text-gray-600 mr-2" />
            Cooking Time (minutes):
          </label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 font-semibold"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
}

export default CreateRecipes;
