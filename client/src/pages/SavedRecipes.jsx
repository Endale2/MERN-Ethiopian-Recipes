import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getUserId from '../hooks/getUserId';
import { FaClock, FaTrash } from 'react-icons/fa';

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/saved-recipes/${userId}`);
        setSavedRecipes(response.data.savedRecipes);
        
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userId]);

  const removeSavedRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5000/recipes/saved-recipes/${userId}/${recipeId}`);
      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-12">Saved Recipes</h1>
      <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedRecipes.map((recipe) => (
          <li
            key={recipe._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleCardClick(recipe._id)}
          >
            <img className="w-full h-40 object-cover" src={recipe.imageURL} alt={recipe.name} />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-orange-800 mb-2">{recipe.name}</h2>
              <p className="text-gray-600 mb-4 truncate">{recipe.instruction}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <FaClock className="mr-2" /> {recipe.cookingTime} mins
              </div>
              <button
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedRecipe(recipe._id);
                }}
              >
                <FaTrash className="mr-2" /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRecipes;
