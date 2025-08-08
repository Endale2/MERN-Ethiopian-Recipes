import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaTrash, FaSpinner, FaHeart, FaUtensils, FaLeaf } from 'react-icons/fa';
import { GiCookingPot, GiKnifeFork } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SavedRecipes() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (!user) {
      setSaved([]);
      setLoading(false);
      toast.info('🙏 Please sign in to view your saved recipes.', { autoClose: 3000 });
      return;
    }

    setLoading(true);
    api.get('/recipes/saved')
      .then(res => setSaved(res.data.savedRecipes || []))
      .catch(err => {
        console.error(err);
        toast.error('😕 Could not load saved recipes.', { autoClose: 3000 });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const removeRecipe = async (id, e) => {
    e.stopPropagation();
    setModalContent(
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTrash className="text-red-500 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-earth-800 mb-2">Remove Recipe?</h3>
        <p className="text-earth-600 mb-6">This action cannot be undone. Are you sure you want to remove this recipe from your favorites?</p>
        <div className="flex justify-center gap-3">
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
            onClick={async () => {
              try {
                await api.delete(`/recipes/saved/${id}`);
                setSaved(prev => prev.filter(r => r._id !== id));
                toast.success('🗑️ Recipe removed from favorites.', { autoClose: 2000 });
              } catch (err) {
                console.error(err);
                toast.error('Failed to remove recipe.', { autoClose: 3000 });
              } finally {
                setShowModal(false);
              }
            }}
          >
            Yes, Remove
          </button>
          <button
            className="px-6 py-3 bg-earth-200 text-earth-700 rounded-xl hover:bg-earth-300 transition-colors font-medium"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
    setShowModal(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ethiopian-50 via-white to-spice-50 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-ethiopian-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeart className="text-ethiopian-500 text-3xl" />
          </div>
          <h1 className="text-3xl font-display font-bold text-earth-800 mb-4">Your Favorite Recipes</h1>
          <p className="text-earth-600 mb-8">Sign in to view and manage your saved Ethiopian recipes.</p>
          <button
            onClick={login}
            className="btn-primary text-lg px-8 py-4"
          >
            <FaSpinner className="animate-spin mr-2" />
            Sign in with Google
          </button>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ethiopian-50 via-white to-spice-50 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="relative mb-6">
            <GiCookingPot className="text-6xl text-ethiopian-500 animate-bounce-gentle" />
            <GiKnifeFork className="absolute -top-2 -right-2 text-2xl text-spice-500 animate-float" />
          </div>
          <h2 className="text-2xl font-bold text-earth-800 mb-2">Loading Your Favorites</h2>
          <p className="text-earth-600">Gathering your saved recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ethiopian-50 via-white to-spice-50">
      {/* Header Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-ethiopian-100 text-ethiopian-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaHeart className="text-red-500" />
                <span>Your Favorites</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient mb-6">
                Your Favorite Ethiopian Flavors
              </h1>
              <p className="text-xl text-earth-600 max-w-2xl mx-auto">
                A collection of your most cherished Ethiopian recipes, carefully saved for future cooking adventures.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-ethiopian-600 mb-2">{saved.length}</div>
                <div className="text-earth-600">Saved Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-spice-600 mb-2">
                  <FaUtensils className="inline-block mr-2" />
                  Ready to Cook
                </div>
                <div className="text-earth-600">Your Collection</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ethiopian-600 mb-2">
                  <FaLeaf className="inline-block mr-2" />
                  Authentic
                </div>
                <div className="text-earth-600">Traditional Flavors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="section-padding bg-white/50 backdrop-blur-sm">
        <div className="container-max">
          {saved.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-ethiopian-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="text-ethiopian-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-earth-800 mb-4">No saved recipes yet!</h3>
              <p className="text-earth-600 mb-8 max-w-md mx-auto">
                Start exploring our collection of authentic Ethiopian recipes and save your favorites for later.
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Browse Recipes
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saved.map((recipe, index) => (
                <div
                  key={recipe._id}
                  className="group card overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recipe.imageURL}
                      alt={recipe.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-500 text-white p-2 rounded-full shadow-glow">
                        <FaHeart className="text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-earth-800 mb-2 line-clamp-2 group-hover:text-ethiopian-600 transition-colors">
                        {recipe.name}
                      </h3>
                      <p className="text-earth-600 text-sm line-clamp-3 mb-4">
                        {recipe.description || 'A delicious Ethiopian recipe from your favorites.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-earth-500 text-sm">
                        <FaClock className="mr-2 text-ethiopian-500" />
                        {recipe.cookingTime} mins
                      </div>
                      <button
                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                        className="text-ethiopian-600 hover:text-ethiopian-700 font-medium text-sm transition-colors"
                      >
                        View Recipe →
                      </button>
                    </div>
                    
                    <button
                      onClick={e => removeRecipe(recipe._id, e)}
                      className="w-full flex items-center justify-center bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
                    >
                      <FaTrash className="mr-2" />
                      Remove from Favorites
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-strong w-full max-w-md animate-scale-in">
            <div className="p-6">
              {modalContent}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
