import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaClock, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SavedRecipes() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load saved recipes when component mounts or user changes
  useEffect(() => {
    if (!user) {
      setSaved([]);
      setLoading(false);
      // Optional: Show a toast if user is not logged in and tries to access this page
      toast.info('Please log in to view your saved recipes.', { toastId: 'login-info' });
      return;
    }
    setLoading(true);
    api.get('/recipes/saved')
      .then(res => {
        setSaved(res.data.savedRecipes || []); // Ensure it's an array
      })
      .catch(err => {
        console.error("Error loading saved recipes:", err);
        // Only show error toast if it's not a 401 (Unauthorized) from non-logged-in user
        if (err.response && err.response.status !== 401) {
          toast.error('Failed to load your saved recipes. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  const removeRecipe = async (id, e) => {
    e.stopPropagation(); // Prevent the parent <li>'s onClick from firing

    if (!window.confirm("Are you sure you want to remove this recipe from your saved list?")) {
        return; // User cancelled the confirmation
    }

    try {
      await api.delete(`/recipes/saved/${id}`);
      setSaved(prev => prev.filter(r => r._id !== id)); // Efficiently update state
      toast.success('Recipe removed from saved list!');
    } catch (err) {
      console.error("Error removing recipe:", err);
      toast.error('Failed to remove recipe. Please try again.');
    }
  };

  // ==========================================================
  // Render based on authentication and loading states
  // ==========================================================

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8 font-inter text-center">
        <p className="text-gray-700 text-2xl font-semibold mb-6">
          To view your saved recipes, please log in.
        </p>
        <button
            onClick={() => navigate('/login')} // Assuming you have a /login route
            className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
        >
            Log In Now
        </button>
        <ToastContainer /> {/* Include ToastContainer here too for this state */}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <FaSpinner className="animate-spin text-orange-600 text-5xl mr-4" />
        <p className="text-gray-700 text-2xl font-medium">Loading your delicious saved recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      {/* Main Page Title - Styled like HomePage */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-orange-800 mb-16 animate-fade-in-down drop-shadow-md font-playfair-display">
        Your Favorite Ethiopian Flavors
      </h1>

      {saved.length === 0 ? (
        <div className="text-center py-10 max-w-2xl mx-auto">
          <p className="text-gray-700 text-2xl font-semibold mb-4">
            You haven't saved any recipes yet!
          </p>
          <p className="text-gray-600 text-lg mb-8">
            Explore our collection and add your favorite dishes to this list.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
          >
            Browse All Recipes
          </button>
        </div>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {saved.map((r, index) => ( // Added index for staggered animation
            <li
              key={r._id}
              onClick={() => navigate(`/recipes/${r._id}`)} // Correct functionality
              className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-103 hover:shadow-2xl cursor-pointer group animate-card-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }} // Staggered animation
            >
              {/* Recipe Image Section - Styled like HomePage */}
              <div className="w-full h-48 overflow-hidden rounded-t-xl relative">
                <img
                  src={r.imageURL || 'https://via.placeholder.com/400x300.png?text=Ethiopian+Food'}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-300"></div>
              </div>

              {/* Recipe Details Section - Styled like HomePage */}
              <div className="p-5">
                <h2 className="text-2xl font-bold text-orange-800 mb-2 truncate group-hover:text-orange-700 transition-colors duration-300">
                  {r.name}
                </h2>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {r.description || r.instruction || 'No description provided.'}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <FaClock className="mr-2 text-orange-500" /> <span className="font-medium">{r.cookingTime || 'N/A'}</span> mins
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/recipes/${r._id}`); }} // Corrected _id
                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center text-lg font-semibold transition-all duration-300 hover:bg-orange-700 shadow-md hover:shadow-lg"
                  >
                    View
                  </button>
                  <button
                    onClick={e => removeRecipe(r._id, e)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center text-lg font-semibold transition-all duration-300 hover:bg-red-700 shadow-md hover:shadow-lg"
                  >
                    <FaTrash className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}