import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaHeart, FaSpinner, FaGoogle, FaPlusCircle } from 'react-icons/fa';
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
        setRecipes(recipesRes.data.reverse());          // newest first
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-yellow-50 p-8">
        <p className="text-red-600 text-2xl mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-yellow-50 to-orange-50">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
        <p className="text-orange-700 text-xl">🍲 Loading recipes…</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative text-center py-12 md:py-16 lg:py-20 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-xl mb-16 transform hover:scale-[1.01] transition">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-utensils-white.svg')] bg-repeat"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Discover & Share Ethiopian Flavors
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-orange-100 mb-8">
            Dive into a world of rich spices and vibrant dishes—your next favorite meal awaits!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!user ? (
              <button
                onClick={login}
                className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
              >
                <FaGoogle /> <span>Continue with Google</span>
              </button>
            ) : (
              <>
                <Link
                  to="/create-recipes"
                  className="inline-flex items-center space-x-2 bg-white text-green-600 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
                >
                  <FaPlusCircle /> <span>Add Your Recipe</span>
                </Link>
                {/* Conditionally render "Saved Recipes" button */}
                {user && (
                  <Link
                    to="/saved-recipes"
                    className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-white hover:text-orange-600 transition"
                  >
                    <FaHeart /> <span>Saved Recipes</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Grid Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-orange-800 mb-8">
        Latest Community Creations
      </h2>

      {/* Cards */}
      <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((r, i) => (
          <li
            key={r._id}
            onClick={() => navigate(`/recipes/${r._id}`)}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer animate-fade-in-up`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-44 overflow-hidden">
              <img
                src={r.imageURL}
                alt={r.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="p-4 flex flex-col h-[inherit] justify-between">
              <div>
                <h3 className="text-xl font-semibold text-orange-700 mb-1 truncate">{r.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{r.description}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaClock className="mr-1 text-orange-500" /> {r.cookingTime} mins
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); toggleSave(r._id); }}
                disabled={savingIds.includes(r._id)}
                className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center font-semibold transition
                  ${isSaved(r._id)
                    ? 'bg-yellow-300 text-gray-800 border border-yellow-400'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                  } ${savingIds.includes(r._id) ? 'cursor-wait' : ''}`}
              >
                {savingIds.includes(r._id)
                  ? <FaSpinner className="animate-spin mr-2" />
                  : <FaHeart className={`mr-2 ${isSaved(r._id) ? 'text-red-600' : 'text-white'}`} />
                }
                {isSaved(r._id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}