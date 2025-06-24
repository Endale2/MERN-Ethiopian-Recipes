import React, { useContext, useState } from 'react';
import { FaHome, FaUtensils, FaBookmark, FaSignOutAlt, FaBars, FaTimes, FaGoogle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = p => location.pathname === p ? 'font-semibold' : '';

  if (loading) return null;

  return (
    <nav className="bg-yellow-100 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center text-orange-700 space-x-2">
          <FaUtensils size={32}/>
          <span className="text-3xl font-extrabold font-cursive">Ethiopian Cuisine</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`flex items-center ${isActive('/')}`}><FaHome className="mr-1"/>Home</Link>
          {user && (
            <>
              <Link to="/create-recipes" className={`flex items-center ${isActive('/create-recipes')}`}><FaUtensils className="mr-1"/>Create</Link>
              <Link to="/saved-recipes" className={`flex items-center ${isActive('/saved-recipes')}`}><FaBookmark className="mr-1"/>Saved</Link>
            </>
          )}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {!user
            ? <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`}
                className="flex items-center text-orange-800 hover:text-orange-600"
              ><FaGoogle className="mr-1"/>Login with Google</button>
            : <button
                onClick={logout}
                className="flex items-center text-orange-800 hover:text-orange-600"
              ><FaSignOutAlt className="mr-1"/>Logout</button>
          }
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(o=>!o)}>
          {menuOpen ? <FaTimes size={24}/> : <FaBars size={24}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 bg-yellow-100">
          <Link to="/" onClick={()=>setMenuOpen(false)} className="block py-2"><FaHome className="mr-1"/>Home</Link>
          {user && (
            <>
              <Link to="/create-recipes" onClick={()=>setMenuOpen(false)} className="block py-2"><FaUtensils className="mr-1"/>Create</Link>
              <Link to="/saved-recipes" onClick={()=>setMenuOpen(false)} className="block py-2"><FaBookmark className="mr-1"/>Saved</Link>
            </>
          )}
          {!user
            ? <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`}
                className="block py-2 flex items-center"
              ><FaGoogle className="mr-1"/>Login</button>
            : <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="block py-2 flex items-center"
              ><FaSignOutAlt className="mr-1"/>Logout</button>
          }
        </div>
      )}
    </nav>
  );
}
