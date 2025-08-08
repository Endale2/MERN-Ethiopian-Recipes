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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    login();
    setMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'shadow-lg' : 'shadow'} backdrop-blur bg-white/70 supports-[backdrop-filter]:bg-white/60 border-b border-orange-100`}>      
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <FaUtensils size={28} className="text-orange-500" />
          <span className="text-2xl font-bold text-orange-600">Ethiopian Cuisine</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center space-x-2">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                location.pathname === to
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Icon className="transition-transform group-hover:-translate-y-0.5" />
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
                className="w-10 h-10 rounded-full ring-2 ring-orange-300 cursor-pointer"
                onClick={() => setDropdownOpen(o => !o)}
              />
              <div className={`absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-orange-100 transform origin-top-right transition ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} ref={menuRef}>
                <Link to="/profile" className="block px-4 py-2 hover:bg-orange-50">Profile</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-full hover:from-orange-700 hover:to-amber-700 transition shadow"
            >
              <AiOutlineGoogle />
              <span>Sign in</span>
            </button>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur border-t" ref={menuRef}>
          <nav className="flex flex-col p-4 space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
            {!user && (
              <button
                onClick={handleLoginClick}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-full hover:from-orange-700 hover:to-amber-700 transition mt-2 shadow"
              >
                <AiOutlineGoogle />
                <span>Sign in</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}