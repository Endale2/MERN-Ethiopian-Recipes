import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axiosConfig';
import { FaClock } from 'react-icons/fa';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New state for loading

  useEffect(() => {
    api.get(`/recipes/${id}`)
      .then(r => {
        setRecipe(r.data);
        setIsLoading(false); // Set loading to false on success
      })
      .catch(() => {
        setError('Could not load recipe.');
        setIsLoading(false); // Set loading to false on error as well
      });
  }, [id]);

  if (error) return <div className="text-red-500 p-8">{error}</div>;

  // Use the new isLoading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
        <p className="ml-4 text-orange-700 text-xl">Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-12">{recipe.name}</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <img src={recipe.imageURL}
               alt={recipe.name}
               className="w-full md:w-1/2 h-64 object-cover"/>
          <div className="p-6 flex-1">
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Ingredients</h2>
            <ul className="list-disc list-inside mb-6">
              {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Instructions</h2>
            <p className="mb-6">{recipe.instruction}</p>
            <div className="flex items-center text-gray-600 mb-6">
              <FaClock className="mr-2"/> {recipe.cookingTime} minutes
            </div>
            <p className="font-semibold">By: {recipe.userOwner.displayName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}