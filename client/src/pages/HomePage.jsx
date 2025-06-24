import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaHeart, FaPlus } from 'react-icons/fa'; // Import FaPlus for the FAB
import Loader from '../components/Loader'; // Import the new Loader component

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true); // New loading state for recipes
  const navigate = useNavigate();
  const { user, loading: authLoading, login, showLoginModal, hideLoginModal } = useContext(AuthContext); // Destructure modal states/functions

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoadingRecipes(true);
      try {
        const r = await api.get('/recipes');
        setRecipes(r.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    const fetchSavedRecipes = async () => {
      if (user) {
        try {
          const r = await api.get('/recipes/saved');
          setSaved(r.data.savedRecipes);
        } catch (error) {
          console.error("Error fetching saved recipes:", error);
        }
      } else {
        setSaved([]); // Clear saved recipes if user logs out
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [user]);

  const saveRecipe = async id => {
    if (!user) {
      hideLoginModal(); // Ensure modal is hidden before showing it
      setTimeout(() => {
        showLoginModal(true); // Show the login modal
      }, 100); // Small delay to ensure state update
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

  // Show a combined loading indicator if either auth or recipes are loading
  if (authLoading || loadingRecipes) {
    return <Loader />;
  }

  return (
    <div className="h-full bg-gradient-to-b from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-extrabold text-center text-orange-800 mb-16 animate-fade-in-down font-playfair-display">
        Savor the Flavors of Ethiopia
      </h1>

      <div className="w-full">
        {recipes.length === 0 ? (
          <p className="text-center text-gray-600 text-xl animate-pulse">No recipes found. Be the first to add one!</p>
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
                  <h2 className="text-2xl font-bold text-orange-800 mb-2 truncate group-hover:text-orange-700 transition-colors duration-300 font-playfair-display">{r.name}</h2>
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

      {user && ( // Show FAB only if user is logged in
        <button
          onClick={() => navigate('/create-recipes')}
          className="fixed bottom-8 right-8 bg-orange-600 text-white p-5 rounded-full shadow-lg text-2xl
                     hover:bg-orange-700 transition-all duration-300 transform hover:scale-110 active:scale-95
                     focus:outline-none focus:ring-4 focus:ring-orange-300 z-40 animate-bounce-slow"
          aria-label="Add new recipe"
        >
          <FaPlus />
        </button>
      )}

      {/* Login Modal */}
      <LoginModal
        show={showLoginModal}
        onClose={hideLoginModal}
        onLogin={login}
      />
    </div>
  );
}