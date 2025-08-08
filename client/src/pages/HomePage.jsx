import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaHeart, FaSpinner, FaGoogle, FaPlusCircle, FaUtensils, FaStar, FaUsers, FaLeaf } from 'react-icons/fa';
import { GiCookingPot, GiKnifeFork } from 'react-icons/gi';
import { toast } from 'react-toastify';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingIds, setSavingIds] = useState([]);
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError('');
      try {
        const recipesRes = await api.get('/recipes');
        setRecipes(recipesRes.data.reverse());          // newest first
        if (user) {
          const savedRes = await api.get('/recipes/saved');
          setSaved(savedRes.data.savedRecipes);
        }
      } catch (err) {
        console.error(err);
        setError('😔 Could not load recipes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [user]);

  const isSaved = id => saved.some(r => r._id === id);

  const toggleSave = async (id) => {
    if (!user) {
      toast.info(
        '🙏 We appreciate you! Please sign in with Google to save recipes.',
        { icon: <FaGoogle className="text-blue-500" />, autoClose: 4000 }
      );
      return login();
    }
    setSavingIds(s => [...s, id]);
    try {
      if (!isSaved(id)) {
        await api.put('/recipes/save', { recipeId: id });
        toast.success('✅ Recipe saved!', { autoClose: 2000 });
      } else {
        await api.delete(`/recipes/saved/${id}`);
        toast.success('🗑️ Recipe removed.', { autoClose: 2000 });
      }
      const { data } = await api.get('/recipes/saved');
      setSaved(data.savedRecipes);
    } catch {
      toast.error('😕 Something went wrong. Please try again.', { autoClose: 3000 });
    } finally {
      setSavingIds(s => s.filter(x => x !== id));
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-ethiopian-50 to-spice-50 p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUtensils className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-earth-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-earth-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-ethiopian-50 to-spice-50">
        <div className="text-center">
          <div className="relative">
            <GiCookingPot className="text-6xl text-ethiopian-500 mb-6 animate-bounce-gentle" />
            <div className="absolute -top-2 -right-2">
              <GiKnifeFork className="text-2xl text-spice-500 animate-float" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-earth-800 mb-2">Loading Delicious Recipes</h2>
          <p className="text-earth-600">Preparing your culinary journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ethiopian-50 via-white to-spice-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
        <div className="container-max relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-ethiopian-100 text-ethiopian-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaLeaf className="text-spice-500" />
                <span>Authentic Ethiopian Cuisine</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gradient mb-6 leading-tight">
                Discover the Rich
                <span className="block">Flavors of Ethiopia</span>
              </h1>
              <p className="text-xl md:text-2xl text-earth-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Embark on a culinary journey through traditional spices, vibrant colors, and authentic recipes that tell the story of Ethiopian culture.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {!user ? (
                <button
                  onClick={login}
                  className="btn-primary text-lg px-8 py-4"
                >
                  <FaGoogle className="mr-2" />
                  Start Your Journey
                </button>
              ) : (
                <>
                  <Link
                    to="/create-recipes"
                    className="btn-primary text-lg px-8 py-4"
                  >
                    <FaPlusCircle className="mr-2" />
                    Share Your Recipe
                  </Link>
                  <Link
                    to="/saved-recipes"
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    <FaHeart className="mr-2" />
                    My Favorites
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-ethiopian-600 mb-2">{recipes.length}</div>
                <div className="text-earth-600">Recipes Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-spice-600 mb-2">
                  <FaUsers className="inline-block mr-2" />
                  Community
                </div>
                <div className="text-earth-600">Growing Daily</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ethiopian-600 mb-2">
                  <FaStar className="inline-block mr-2" />
                  Authentic
                </div>
                <div className="text-earth-600">Traditional Recipes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="section-padding bg-white/50 backdrop-blur-sm">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-earth-800 mb-4">
              Latest Community Creations
            </h2>
            <p className="text-xl text-earth-600 max-w-2xl mx-auto">
              Discover the newest recipes shared by our passionate community of Ethiopian food lovers.
            </p>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-ethiopian-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUtensils className="text-ethiopian-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-earth-800 mb-4">No recipes yet!</h3>
              <p className="text-earth-600 mb-8">Be the first to share your favorite Ethiopian recipe.</p>
              {user && (
                <Link to="/create-recipes" className="btn-primary">
                  <FaPlusCircle className="mr-2" />
                  Create First Recipe
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recipes.map((recipe, index) => (
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
                      <button
                        onClick={e => { e.stopPropagation(); toggleSave(recipe._id); }}
                        disabled={savingIds.includes(recipe._id)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isSaved(recipe._id)
                            ? 'bg-red-500 text-white shadow-glow'
                            : 'bg-white/90 text-earth-600 hover:bg-red-500 hover:text-white'
                        } ${savingIds.includes(recipe._id) ? 'cursor-wait' : ''}`}
                      >
                        {savingIds.includes(recipe._id) ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaHeart className={isSaved(recipe._id) ? 'text-white' : ''} />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-earth-800 mb-2 line-clamp-2 group-hover:text-ethiopian-600 transition-colors">
                        {recipe.name}
                      </h3>
                      <p className="text-earth-600 text-sm line-clamp-3 mb-4">
                        {recipe.description || 'A delicious Ethiopian recipe waiting to be discovered.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-ethiopian-500 to-spice-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
        <div className="container-max relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Share Your Recipe?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community and share your favorite Ethiopian dishes with food lovers around the world.
          </p>
          {user ? (
            <Link to="/create-recipes" className="btn-secondary text-lg px-8 py-4 bg-white/20 border-white/30 text-white hover:bg-white hover:text-ethiopian-600">
              <FaPlusCircle className="mr-2" />
              Create Recipe
            </Link>
          ) : (
            <button onClick={login} className="btn-secondary text-lg px-8 py-4 bg-white/20 border-white/30 text-white hover:bg-white hover:text-ethiopian-600">
              <FaGoogle className="mr-2" />
              Get Started
            </button>
          )}
        </div>
      </section>
    </div>
  );
}