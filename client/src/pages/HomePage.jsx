import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaHeart } from 'react-icons/fa';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const [error, setError] = useState(''); // State for potential errors
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true); // Start loading
      setError(''); // Clear previous errors

      try {
        const [recipesRes, savedRes] = await Promise.allSettled([
          api.get('/recipes'),
          user ? api.get('/recipes/saved') : Promise.resolve(null) // Only fetch saved if user exists
        ]);

        if (recipesRes.status === 'fulfilled') {
          setRecipes(recipesRes.value.data);
        } else {
          console.error("Error fetching recipes:", recipesRes.reason);
          setError("Could not load recipes.");
        }

        if (user && savedRes.status === 'fulfilled') {
          setSaved(savedRes.value.data.savedRecipes);
        } else if (user && savedRes.status === 'rejected') {
          console.error("Error fetching saved recipes:", savedRes.reason);
          // Don't set a global error for saved recipes, as main recipes might still load
        }

      } catch (err) {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred while loading recipes.");
      } finally {
        setIsLoading(false); // End loading regardless of success or failure
      }
    };

    fetchRecipes();
  }, [user]); // Depend on user to re-fetch saved recipes if user state changes

  const saveRecipe = async id => {
    if (!user) {
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

  // --- Loader and Error Handling ---
  if (error) {
    return <div className="text-red-500 p-8 text-center text-xl">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500"></div>
        <p className="ml-4 text-orange-700 text-xl">Whipping up delicious recipes...</p>
      </div>
    );
  }
  // --- End Loader and Error Handling ---

  return (
    <div className="h-full bg-gradient-to-b from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-extrabold text-center text-orange-800 mb-16 animate-fade-in-down">
        Savor the Flavors of Ethiopia
      </h1>

      <div className="w-full">
        {recipes.length === 0 ? ( // Display "No recipes found" if recipes array is empty after loading
          <p className="text-center text-gray-600 text-xl">No delicious recipes found. Check back later!</p>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-6 lg:px-8">
            {recipes.map((r, index) => (
              <li key={r._id}
                className={`bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-103 hover:shadow-2xl cursor-pointer group animate-fade-in delay-${index * 100}`}
                onClick={() => navigate(`/recipes/${r._id}`)}>
                <div className="w-full h-48 overflow-hidden">
                  <img src={r.imageURL || 'https://via.placeholder.com/400x300.png?text=Ethiopian+Food'} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"/>
                </div>
                <div className="p-5">
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