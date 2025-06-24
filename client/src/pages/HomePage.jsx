// src/pages/HomePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaHeart, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingIds, setSavingIds] = useState([]);         // track which recipes are being (un)saved
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError('');

      try {
        const recipesRes = await api.get('/recipes');
        setRecipes(recipesRes.data);

        if (user) {
          const savedRes = await api.get('/recipes/saved');
          setSaved(savedRes.data.savedRecipes);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load recipes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  const isSaved = id => saved.some(r => r._id === id);

  const toggleSave = async (id) => {
    if (!user) {
      toast.info('Please continue with Google to save recipes.', { autoClose: 3000 });
      login();
      return;
    }

    // Start loader on this card
    setSavingIds(ids => [...ids, id]);
    try {
      if (!isSaved(id)) {
        await api.put('/recipes/save', { recipeId: id });
      } else {
        await api.delete(`/recipes/saved/${id}`);
      }
      // Refresh saved list
      const { data } = await api.get('/recipes/saved');
      setSaved(data.savedRecipes);
    } catch (err) {
      console.error(err);
      toast.error('Could not update saved status.', { autoClose: 3000 });
    } finally {
      setSavingIds(ids => ids.filter(x => x !== id));
    }
  };

  if (error) {
    return <div className="text-red-500 p-8 text-center text-xl">{error}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
        <p className="text-orange-700 text-xl">Loading delicious recipes…</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative utensil icons in the background */}
      <div className="pointer-events-none absolute inset-0 opacity-5 bg-[url('/pattern-utensils.svg')] bg-repeat"></div>

      <h1 className="relative text-5xl font-extrabold text-center text-orange-800 mb-16 animate-fade-in-down">
        Savor the Flavors of Ethiopia
      </h1>

      <ul className="relative grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((r, i) => (
          <li
            key={r._id}
            onClick={() => navigate(`/recipes/${r._id}`)}
            className={`relative bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 
                        hover:scale-103 hover:shadow-2xl cursor-pointer group animate-fade-in-up delay-${i * 100}`}
          >
            <div className="w-full h-48 overflow-hidden">
              <img
                src={r.imageURL}
                alt={r.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-bold text-orange-800 mb-2 truncate group-hover:text-orange-700 transition-colors duration-300">
                {r.name}
              </h2>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{r.description}</p>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <FaClock className="mr-2 text-orange-500" />
                <span className="font-medium">{r.cookingTime} mins</span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); toggleSave(r._id); }}
                disabled={savingIds.includes(r._id)}
                className={`w-full py-3 rounded-lg flex items-center justify-center text-lg font-semibold transition-all duration-300
                  ${isSaved(r._id)
                    ? 'bg-yellow-300 text-gray-800 border border-yellow-400'
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'
                  } ${savingIds.includes(r._id) ? 'cursor-wait' : ''}`}
              >
                {savingIds.includes(r._id) ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaHeart className={`mr-2 ${isSaved(r._id) ? 'text-red-600' : 'text-white'}`} />
                )}
                {isSaved(r._id) ? 'Saved' : 'Save Recipe'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
