import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  FaHome,
  FaUtensils,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSpinner,
  FaLeaf
} from 'react-icons/fa';
import { GiCookingPot } from 'react-icons/gi';
import { AiOutlineGoogle } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

export default function NavBar() {
  const { user, loading, login, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const avatarRef = useRef(null);
  const menuRef = useRef(null);

  const links = [
    { to: '/', label: 'Home', icon: FaHome },
    ...(user
      ? [
          { to: '/create-recipes', label: 'Create Recipe', icon: FaUtensils },
          { to: '/saved-recipes', label: 'Saved Recipes', icon: FaBookmark }
        ]
      : [])
  ];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target) && menuOpen) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    login();
    setMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass-effect shadow-medium' 
        : 'bg-gradient-to-r from-ethiopian-50 via-white to-spice-50 shadow-soft'
    }`}>      
      <div className="container-max px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <GiCookingPot className="text-3xl text-ethiopian-500 group-hover:text-ethiopian-600 transition-colors" />
              <FaLeaf className="absolute -top-1 -right-1 text-sm text-spice-500" />
            </div>
            <div>
              <span className="text-2xl font-display font-bold text-gradient">Ethiopian</span>
              <span className="block text-sm font-medium text-earth-600">Cuisine</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === to
                    ? 'bg-ethiopian-100 text-ethiopian-700 shadow-soft'
                    : 'text-earth-600 hover:bg-ethiopian-50 hover:text-ethiopian-600'
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2 text-ethiopian-500">
                <FaSpinner className="animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : user ? (
              <div className="relative" ref={avatarRef}>
                <div className="flex items-center space-x-3">
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-earth-800">
                      {user.displayName || 'User'}
                    </div>
                    <div className="text-xs text-earth-500">Welcome back!</div>
                  </div>
                  <img
                    src={user.photoURL || ''}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 border-ethiopian-200 cursor-pointer hover:border-ethiopian-400 transition-colors shadow-soft"
                    onClick={() => setDropdownOpen(o => !o)}
                  />
                </div>
                
                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-3 w-56 glass-effect rounded-2xl shadow-strong transform transition-all duration-300 ${
                  dropdownOpen 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                }`}>
                  <div className="p-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-ethiopian-50 text-earth-700 hover:text-ethiopian-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUserCircle className="text-lg" />
                      <span>Profile</span>
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }} 
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="btn-primary text-sm px-6 py-2"
              >
                <AiOutlineGoogle className="mr-2" />
                Sign in
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 rounded-xl hover:bg-ethiopian-50 transition-colors"
              onClick={() => setMenuOpen(o => !o)}
            >
              {menuOpen ? <FaTimes size={24} className="text-earth-600" /> : <FaBars size={24} className="text-earth-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden glass-effect border-t border-ethiopian-100">
          <nav className="p-4 space-y-2" ref={menuRef}>
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-ethiopian-100 text-ethiopian-700'
                    : 'text-earth-600 hover:bg-ethiopian-50 hover:text-ethiopian-600'
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </Link>
            ))}
            {!user && (
              <button
                onClick={handleLoginClick}
                className="w-full btn-primary mt-4"
              >
                <AiOutlineGoogle className="mr-2" />
                Sign in with Google
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}