import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { FaEnvelope, FaUtensils } from 'react-icons/fa';

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="p-8 text-center">Not logged in.</div>;

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <img src={user.photoURL} alt="avatar" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-orange-800 mb-2">{user.displayName}</h2>
        <p className="text-gray-700 mb-4"><FaEnvelope className="inline mr-1"/>{user.email}</p>
        {/* Optionally show number of saved recipes or other info */}
        <p className="text-gray-600"><FaUtensils className="inline mr-1"/> You have {user.savedRecipes?.length || 0} saved recipes.</p>
      </div>
    </div>
  );
}
