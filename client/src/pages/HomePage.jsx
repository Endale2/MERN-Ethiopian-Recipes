import React, { useEffect, useState, useContext } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaClock, FaHeart } from 'react-icons/fa';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/recipes')
      .then(r => setRecipes(r.data))
      .catch(console.error);

    if (user) {
      api.get('/recipes/saved')
        .then(r => setSaved(r.data.savedRecipes))
        .catch(console.error);
    }
  }, [user]);

  const saveRecipe = async id => {
    await api.put('/recipes/save', { recipeId: id });
    const r = await api.get('/recipes/saved');
    setSaved(r.data.savedRecipes);
  };

  const isSaved = id => saved.some(r => r._id === id);

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-12">Delicious Recipes</h1>
      <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map(r => (
          <li key={r._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform cursor-pointer"
            onClick={() => navigate(`/recipes/${r._id}`)}>
            <img src={r.imageURL} alt={r.name} className="w-full h-40 object-cover"/>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-orange-800 mb-2">{r.name}</h2>
              <p className="text-gray-600 mb-4 truncate">{r.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <FaClock className="mr-2"/> {r.cookingTime} mins
              </div>
              <button
                className={`w-full py-2 rounded-md flex items-center justify-center 
                  ${isSaved(r._id)
                    ? 'bg-yellow-300 text-gray-800 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                onClick={e => { e.stopPropagation(); saveRecipe(r._id); }}
                disabled={isSaved(r._id)}
              >
                <FaHeart className={`mr-2 ${isSaved(r._id) ? 'text-red-600' : ''}`}/>
                {isSaved(r._id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
