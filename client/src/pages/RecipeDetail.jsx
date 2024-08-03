import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaClock } from 'react-icons/fa';

function RecipeDetail() {
  const { id } = useParams(); // Use 'id' to match the path parameter in the route
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/${id}/`);
        if (response.data) {
          setRecipe(response.data);
        } else {
          setError('Recipe not found'); // Handle case where no data is returned
        }
      } catch (err) {
        console.log('Error fetching recipe:', err);
        setError('An error occurred while fetching the recipe'); // Handle API errors
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <div className="min-h-screen bg-yellow-50 py-12 px-4 text-center text-red-500">{error}</div>;
  }

  if (!recipe) {
    return <div className="min-h-screen bg-yellow-50 py-12 px-4 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-12">{recipe.name}</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <img
            className="w-full md:w-1/2 h-64 object-cover"
            src={recipe.imageURL}
            alt={recipe.name}
          />
          <div className="p-6 flex-1">
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Ingredients</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Instructions</h2>
            <p className="text-gray-700 mb-6">{recipe.instruction}</p>
            <div className="flex items-center text-gray-600 mb-6">
              <FaClock className="mr-2" /> {recipe.cookingTime} minutes
            </div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Recipe by:</h3>
            <p className="text-gray-700">{recipe.userOwner.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
