import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaTrash } from 'react-icons/fa';

export default function SavedRecipes() {
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();

  const load = () =>
    api.get('/recipes/saved')
       .then(r => setSaved(r.data.savedRecipes))
       .catch(console.error);

  useEffect(load, []);

  const remove = async id => {
    await api.delete(`/recipes/saved/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-12">Saved Recipes</h1>
      <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {saved.map(r => (
          <li key={r._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform cursor-pointer">
            <img src={r.imageURL} alt={r.name} className="w-full h-40 object-cover"/>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-orange-800 mb-2">{r.name}</h2>
              <p className="text-gray-600 mb-4 truncate">{r.instruction}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <FaClock className="mr-2"/> {r.cookingTime} mins
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/recipes/${r._id}`)}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                >View</button>
                <button
                  onClick={() => remove(r._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                ><FaTrash className="mr-1"/>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
