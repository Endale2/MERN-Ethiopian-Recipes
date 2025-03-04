import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getUserId from '../hooks/getUserId';
import { FaClock, FaHeart } from 'react-icons/fa';

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const userId = getUserId();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recipes");
        setRecipes(response.data);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/saved-recipes/${userId}`);
        setSavedRecipes(response.data.savedRecipes);
        console.log(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userId]);

  const saveRecipe = async (recipeId) => {
    try {
      const response = await axios.put("http://localhost:5000/recipes", { recipeId, userId });
      console.log(response);
      // Refresh saved recipes after saving a new one
      const savedResponse = await axios.get(`http://localhost:5000/recipes/saved-recipes/${userId}`);
      setSavedRecipes(savedResponse.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (recipeId) => {
    return savedRecipes.some((savedRecipe) => savedRecipe._id === recipeId);
  };

  const handleCardClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-12">Delicious Recipes</h1>
      <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <li
            key={recipe._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleCardClick(recipe._id)}
          >
            <img className="w-full h-40 object-cover" src={recipe.imageURL} alt={recipe.name} />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-orange-800 mb-2">{recipe.name}</h2>
              <p className="text-gray-600 mb-4 truncate">{recipe.describtion}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <FaClock className="mr-2" /> {recipe.cookingTime} mins
              </div>
              {isRecipeSaved(recipe._id) ? (
                <button
                  className="w-full bg-yellow-300 text-gray-800 py-2 rounded-md flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveRecipe(recipe._id);
                  }}
                  disabled
                >
                  <FaHeart className="text-red-600 mr-2" /> Saved
                </button>
              ) : (
                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveRecipe(recipe._id);
                  }}
                >
                  <FaHeart className="mr-2" /> Save
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
