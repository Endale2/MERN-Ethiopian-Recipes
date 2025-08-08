import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaTrash, FaSpinner } from 'react-icons/fa';
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
        <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={async () => {
              try {
                await api.delete(`/recipes/saved/${id}`);
                setSaved(prev => prev.filter(r => r._id !== id));
                toast.success('🗑️ Recipe removed.', { autoClose: 2000 });
              } catch (err) {
                console.error(err);
                toast.error('Failed to remove recipe.', { autoClose: 3000 });
              } finally {
                setShowModal(false);
              }
            }}
          >
            Yes, remove
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <p className="text-2xl text-gray-700 mb-6">You need to sign in to see saved recipes.</p>
        <button
          onClick={login}
          className="inline-flex items-center bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-amber-700 transition shadow"
        >
          <FaSpinner className="animate-spin mr-2" /> Sign in with Google
        </button>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
        <p className="text-xl text-orange-700">Loading your favorites…</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-orange-800 mb-12">
          Your Favorite Ethiopian Flavors
        </h1>

        {saved.length === 0 ? (
          <div className="text-center py-10 max-w-lg mx-auto">
            <p className="text-2xl text-gray-700 mb-4">No saved recipes yet!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-amber-700 transition shadow"
            >
              Browse Recipes
            </button>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map((r) => (
              <li
                key={r._id}
                onClick={() => navigate(`/recipes/${r._id}`)}
                className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={r.imageURL}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
                </div>
                <div className="p-4 flex flex-col justify-between h-[200px]">
                  <div>
                    <h2 className="text-xl font-semibold text-orange-700 mb-1 truncate">{r.name}</h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {r.description || 'No description available.'}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaClock className="mr-1 text-orange-500" /> {r.cookingTime} mins
                    </div>
                  </div>
                  <button
                    onClick={e => removeRecipe(r._id, e)}
                    className="mt-4 flex items-center justify-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <FaTrash className="mr-2" /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm animate-fade-in">
              {modalContent}
            </div>
          </div>
        )}

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
}
