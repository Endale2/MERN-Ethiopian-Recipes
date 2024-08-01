import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getUserId from '../hooks/getUserId';
import { FaClock } from 'react-icons/fa';

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userId = getUserId();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/saved-recipes/${userId}`);
        setSavedRecipes(response.data.savedRecipes);
        console.log(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userId]);

  return (
    <div className="min-h-screen bg-yellow-50 py-10">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-10">Saved Recipes</h1>
      <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4">
        {savedRecipes.map((recipe) => (
          <li key={recipe._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
            <img className="w-full h-48 object-cover rounded-t-lg" src={recipe.imageURL} alt={recipe.name} />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-orange-800 mb-2">{recipe.name}</h2>
              <p className="text-gray-700 mb-4">{recipe.instruction}</p>
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" /> {recipe.cookingTime} minutes
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRecipes;
