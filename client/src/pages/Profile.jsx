// src/pages/UserProfile.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  FaUserCircle, FaSpinner, FaPlusCircle, FaHeart,
  FaFileAlt, FaSignOutAlt, FaShareSquare, FaBookmark, FaExclamationCircle
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserProfile() {
  const { user, logout, login } = useContext(AuthContext); // Added login for non-logged-in state
  const navigate = useNavigate();
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created'); // 'created' or 'saved'

  useEffect(() => {
    if (!user) {
      setLoading(false);
      // Only show toast if user is not logged in and it's the first render
      if (!sessionStorage.getItem('profileLoginPromptShown')) {
        toast.info('👋 Please sign in to view your profile.', { autoClose: 3000 });
        sessionStorage.setItem('profileLoginPromptShown', 'true');
      }
      return;
    } else {
      // Clear the prompt flag if user logs in
      sessionStorage.removeItem('profileLoginPromptShown');
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch created recipes
        const createdRes = await api.get('/recipes/user');
        setCreatedRecipes(createdRes.data.recipes || []);

        // Fetch saved recipes
        const savedRes = await api.get('/recipes/saved');
        setSavedRecipes(savedRes.data.savedRecipes || []);

      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        toast.error('Failed to load profile data. Please try again.', { autoClose: 4000 });
        // Optionally redirect or show a specific error message
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]); // Re-fetch when user changes

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    toast.success('👋 You have been signed out.', { autoClose: 2000 });
    navigate('/'); // Redirect to homepage after logout
  };

  const renderRecipeList = (recipes, type) => {
    if (recipes.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          <FaExclamationCircle className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-medium mb-3">
            {type === 'created' ? "You haven't created any recipes yet!" : "No saved recipes here!"}
          </p>
          {type === 'created' ? (
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-full font-semibold shadow-md hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              <FaPlusCircle className="mr-2" /> Create Your First Recipe
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-full font-semibold shadow-md hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
            >
              <FaBookOpen className="mr-2" /> Browse Recipes to Save
            </button>
          )}
        </div>
      );
    }

    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {recipes.map(recipe => (
          <li
            key={recipe._id}
            onClick={() => navigate(`/recipes/${recipe._id}`)}
            className="flex items-center bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-[1.01]"
          >
            <img
              src={recipe.imageURL || 'https://via.placeholder.com/100x100?text=No+Image'}
              alt={recipe.name}
              className="w-28 h-28 object-cover rounded-l-xl flex-shrink-0"
            />
            <div className="p-4 flex-1">
              <h3 className="text-lg font-semibold text-orange-700 leading-tight line-clamp-2">
                {recipe.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <FaClock className="mr-1 text-orange-400" /> {recipe.cookingTime} mins
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderHorizontalRecipeList = (recipes, type) => {
    if (recipes.length === 0) {
      return (
        <div className="text-center py-6 text-gray-600">
          <FaExclamationCircle className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-lg font-medium mb-3">
            {type === 'created' ? "You haven't created any recipes yet!" : "No saved recipes here!"}
          </p>
          {type === 'created' ? (
            <button
              onClick={() => navigate('/create')}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold hover:bg-orange-700 transition"
            >
              <FaPlusCircle className="mr-2" /> Create Recipe
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold hover:bg-orange-700 transition"
            >
              <FaBookOpen className="mr-2" /> Browse & Save
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide">
        {recipes.map(recipe => (
          <div
            key={recipe._id}
            onClick={() => navigate(`/recipes/${recipe._id}`)}
            className="flex-shrink-0 w-32 md:w-36 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 transform hover:scale-[1.03]"
          >
            <img
              src={recipe.imageURL || 'https://via.placeholder.com/150x150?text=No+Image'}
              alt={recipe.name}
              className="w-full h-24 object-cover rounded-t-lg"
            />
            <div className="p-2 text-center">
              <p className="text-sm font-semibold text-gray-800 line-clamp-2 h-10">
                {recipe.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-yellow-50 to-orange-100 p-8 text-center animate-fade-in">
        <FaUserCircle className="text-orange-400 text-8xl mb-6" />
        <p className="text-3xl font-bold text-gray-800 mb-6">Welcome!</p>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Sign in to view your personalized profile, created recipes, and saved favorites.
        </p>
        <button
          onClick={login}
          className="inline-flex items-center bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
        >
          <FaSpinner className="animate-spin mr-3 text-xl" /> Sign in with Google
        </button>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-yellow-50 to-orange-100 p-8 animate-fade-in">
        <FaSpinner className="animate-spin text-5xl text-orange-500 mb-6" />
        <p className="text-2xl font-medium text-orange-700">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
        {/* User Info Section */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-gray-200 mb-8">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-200 shadow-md mb-4"
            />
          ) : (
            <FaUserCircle className="text-gray-400 text-8xl mb-4" />
          )}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{user.name || 'Ethiopian Foodie'}</h1>
          <p className="text-lg text-gray-600 mb-4">{user.email}</p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-full font-semibold shadow-md hover:bg-red-600 transition-colors duration-300"
          >
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 bg-gray-50 rounded-full p-2 shadow-inner">
          <button
            onClick={() => setActiveTab('created')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeTab === 'created' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaShareSquare className="mr-2" /> Your Recipes ({createdRecipes.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeTab === 'saved' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaBookmark className="mr-2" /> Saved Recipes ({savedRecipes.length})
          </button>
        </div>

        {/* Recipes Display Area */}
        <div>
          {activeTab === 'created' ? (
            <>
              <h2 className="text-3xl font-bold text-orange-800 mb-6 flex items-center justify-center">
                <FaFileAlt className="mr-3 text-orange-600" /> Recipes You've Shared
              </h2>
              {renderRecipeList(createdRecipes, 'created')} {/* Render full card list for created */}
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-orange-800 mb-6 flex items-center justify-center">
                <FaHeart className="mr-3 text-orange-600" /> Your Favorite Saved Recipes
              </h2>
              {renderHorizontalRecipeList(savedRecipes, 'saved')} {/* Render horizontal list for saved */}
            </>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}