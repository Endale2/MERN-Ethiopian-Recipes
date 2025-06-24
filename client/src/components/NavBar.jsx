import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  FaHome,
  FaUtensils,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa';
import { AiOutlineGoogle } from 'react-icons/ai'; // Google icon
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx'; // Ensure this path is correct


export default function NavBar() {
  const { user, loading, login, logout, setShowLoginModal } = useContext(AuthContext);
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
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(!isScrolled); // Corrected logic: setScrolled(isScrolled)
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  if (loading) return null; // You might want a full-page loader for initial load in App.jsx

  const handleLoginClick = () => {
    setShowLoginModal(true); // Open the login modal
  };

  return (
    <header className={`sticky top-0 z-50 font-inter transition-all duration-300
      ${scrolled ? 'bg-white bg-opacity-90 shadow-lg backdrop-blur-sm' : 'bg-white shadow-md'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between animate-fade-in-down">
        {/* Logo and Site Title */}
        <Link to="/" className="flex items-center space-x-3 group">
          <FaUtensils size={32} className="text-orange-600 group-hover:text-orange-700 hover:rotate-6 transition-transform duration-300 animate-flicker" />
          <span className="text-3xl font-extrabold tracking-tight font-playfair-display text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
            Ethiopian Cuisine
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-2 text-lg font-medium relative group px-2 py-1 rounded-md
                ${
                  location.pathname === to
                    ? 'text-orange-700 font-semibold'
                    : 'text-gray-700 hover:text-orange-600'
                } transition-all duration-300 ease-in-out hover:bg-yellow-50`}
            >
              <Icon className="text-xl group-hover:scale-110 transition-transform duration-200" />
              <span>{label}</span>
              {location.pathname === to && (
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-orange-500 rounded-full animate-hover-underline"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Authentication/User Section & Mobile Toggle */}
        <div className="flex items-center space-x-6">
          {user ? (
            // User Avatar and Dropdown
            <div ref={avatarRef} className="relative">
              <img
                src={
                  user.photoURL ||
                  `https://placehold.co/50x50/cccccc/333333?text=${
                    user.email ? user.email[0].toUpperCase() : 'U'
                  }`
                }
                alt="avatar"
                className="w-12 h-12 rounded-full cursor-pointer border-3 border-orange-400 object-cover
                            transition-all duration-300 hover:border-orange-600 hover:shadow-lg hover:scale-105"
                onClick={() => setDropdownOpen((o) => !o)}
              />
              {/* Dropdown Menu for Logged-in User */}
              <div
                className={`absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 origin-top-right transform transition-all duration-300 ease-out
                  ${dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
              >
                <ul>
                  <li className="px-5 py-3 text-lg font-medium text-gray-800 border-b border-gray-100">
                    Hello, <span className="text-orange-700 font-semibold">{user.displayName || user.email?.split('@')[0] || 'User'}</span>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => { setDropdownOpen(false); setMenuOpen(false); }}
                      className="flex items-center px-5 py-3 hover:bg-orange-50 hover:text-orange-700 cursor-pointer text-gray-800 transition-all duration-200"
                    >
                      <FaUserCircle className="mr-3 text-xl" /> Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="w-full text-left flex items-center px-5 py-3 hover:bg-red-50 hover:text-red-700 cursor-pointer text-red-600 transition-all duration-200"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      <FaSignOutAlt className="mr-3 text-xl" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            // "Continue with Google" Button
            <button
              onClick={handleLoginClick}
              className="flex items-center space-x-3 bg-amber-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg
                            hover:bg-amber-700 transition-all duration-300 hover:scale-105 transform
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 group"
            >
              <AiOutlineGoogle className="text-2xl group-hover:rotate-6 transition-transform duration-300" />
              <span>Continue with Google</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-gray-700 hover:text-orange-600 transition-colors duration-200"
          >
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav ref={menuRef} className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-down origin-top">
          <ul className="flex flex-col py-3">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-6 py-3 text-lg font-medium transition-all duration-200
                    ${
                      location.pathname === to
                        ? 'bg-orange-50 text-orange-700 font-semibold'
                        : 'text-gray-800 hover:bg-yellow-50'
                    }`}
                >
                  <Icon className="text-xl" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}
                    className="flex items-center space-x-3 px-6 py-3 text-lg text-gray-800 hover:bg-yellow-50 transition-all duration-200"
                  >
                    <FaUserCircle className="text-xl" /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left flex items-center space-x-3 px-6 py-3 text-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <FaSignOutAlt className="text-xl" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left flex items-center space-x-3 px-6 py-3 text-lg text-gray-800 hover:bg-yellow-50 transition-all duration-200"
                >
                  <AiOutlineGoogle className="text-xl" /> Continue with Google
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}