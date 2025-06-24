import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  FaHome,
  FaUtensils,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSpinner
} from 'react-icons/fa';
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
    <header className={`sticky top-0 z-50 bg-gradient-to-r from-yellow-100 via-orange-50 to-yellow-100 transition-shadow ${scrolled ? 'shadow-lg' : 'shadow'} py-4`}>      
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <FaUtensils size={28} className="text-orange-500" />
          <span className="text-2xl font-bold text-orange-600">Ethiopian Cuisine</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-6">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                location.pathname === to
                  ? 'bg-orange-200 text-orange-700'
                  : 'text-gray-700 hover:bg-yellow-200 hover:text-orange-600'
              } transition`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Auth & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-2 text-orange-500">
              <FaSpinner className="animate-spin" />
            </div>
          ) : user ? (
            <div className="relative" ref={avatarRef}>
              <img
                src={user.photoURL || ''}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-orange-400 cursor-pointer"
                onClick={() => setDropdownOpen(o => !o)}
              />
              <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg transform transition ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} ref={menuRef}>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <AiOutlineGoogle />
              <span>Sign in</span>
            </button>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col p-4 space-y-2" ref={menuRef}>
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-yellow-100"
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
            {!user && (
              <button
                onClick={handleLoginClick}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition mt-2"
              >
                <AiOutlineGoogle />
                <span>Sign in</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>  );}