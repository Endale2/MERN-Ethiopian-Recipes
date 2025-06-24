import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaHeart } from 'react-icons/fa';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch all recipes
    api.get('/recipes')
      .then(r => setRecipes(r.data))
      .catch(error => console.error("Error fetching recipes:", error));

    // Fetch saved recipes if user is logged in
    if (user) {
      api.get('/recipes/saved')
        .then(r => setSaved(r.data.savedRecipes))
        .catch(error => console.error("Error fetching saved recipes:", error));
    }
  }, [user]);

  const saveRecipe = async id => {
    if (!user) {
      // Optionally, you can show a toast notification or a modal here
      alert("Please log in to save recipes!");
      return;
    }
    try {
      await api.put('/recipes/save', { recipeId: id });
      const r = await api.get('/recipes/saved');
      setSaved(r.data.savedRecipes);
    } catch (error) {
      console.error("Error saving recipe:", error);
      // Handle error, e.g., show a message to the user
    }
  };

  const isSaved = id => saved.some(r => r._id === id);

  return (
    // Changed min-h-screen to h-full for potentially full height, removed max-width constraints for background
    <div className="h-full bg-gradient-to-b from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Title with improved animation */}
      <h1 className="text-5xl font-extrabold text-center text-orange-800 mb-16 animate-fade-in-down">
        Savor the Flavors of Ethiopia
      </h1>

      {/* Removed max-w-7xl and mx-auto from this div to allow content to spread */}
      <div className="w-full">
        {recipes.length === 0 && !user ? (
          // Loading message with a subtle pulse animation
          <p className="text-center text-gray-600 text-xl animate-pulse">Loading delicious recipes or no recipes found...</p>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-6 lg:px-8"> {/* Added back padding for grid */}
            {recipes.map((r, index) => (
              <li key={r._id}
                // Card animations: fade-in, scale on hover, shadow
                className={`bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-103 hover:shadow-2xl cursor-pointer group animate-fade-in delay-${index * 100}`}
                onClick={() => navigate(`/recipes/${r._id}`)}>
                <div className="w-full h-48 overflow-hidden">
                  {/* Image hover effect */}
                  <img src={r.imageURL || 'https://via.placeholder.com/400x300.png?text=Ethiopian+Food'} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"/>
                </div>
                <div className="p-5">
                  {/* Title hover effect */}
                  <h2 className="text-2xl font-bold text-orange-800 mb-2 truncate group-hover:text-orange-700 transition-colors duration-300">{r.name}</h2>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{r.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaClock className="mr-2 text-orange-500"/> <span className="font-medium">{r.cookingTime}</span> mins
                  </div>
                  <button
                    className={`w-full py-3 rounded-lg flex items-center justify-center text-lg font-semibold transition-all duration-300
                      ${isSaved(r._id)
                        ? 'bg-yellow-300 text-gray-800 cursor-not-allowed border border-yellow-400 animate-heart-beat'
                        : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'
                      }`}
                    onClick={e => { e.stopPropagation(); saveRecipe(r._id); }}
                    disabled={isSaved(r._id)}
                  >
                    <FaHeart className={`mr-2 ${isSaved(r._id) ? 'text-red-600' : 'text-white'}`}/>
                    {isSaved(r._id) ? 'Saved' : 'Save Recipe'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}