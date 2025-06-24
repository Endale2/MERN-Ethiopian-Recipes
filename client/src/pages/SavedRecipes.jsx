import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaClock, FaTrash } from 'react-icons/fa';

export default function SavedRecipes() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load saved recipes when component mounts or user changes
  useEffect(() => {
    if (!user) {
      setSaved([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get('/recipes/saved')
      .then(res => setSaved(res.data.savedRecipes))
      .catch(err => {
        console.error(err);
        setError('Could not load saved recipes.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const remove = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/recipes/saved/${id}`);
      setSaved(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to remove recipe.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Please log in to view your saved recipes.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Loading your saved recipes…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-12">
        Your Saved Recipes
      </h1>

      {error && (
        <p className="text-center text-red-500 mb-6">{error}</p>
      )}

      {saved.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You haven't saved any recipes yet.
        </p>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {saved.map(r => (
            <li
              key={r._id}
              onClick={() => navigate(`/recipes/${r._id}`)}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition cursor-pointer"
            >
              <img
                src={r.imageURL}
                alt={r.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-orange-800 mb-2">
                  {r.name}
                </h2>
                <p className="text-gray-600 mb-4 truncate">
                  {r.instruction}
                </p>
                <div className="flex items-center text-gray-500 mb-4">
                  <FaClock className="mr-2" /> {r.cookingTime} mins
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/recipes/${r._1d}`); }}
                    className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={e => remove(r._id, e)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
