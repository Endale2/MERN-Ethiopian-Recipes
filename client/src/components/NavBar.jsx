import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUtensils, FaBookmark, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

function NavBar() {
  const [cookies, setCookies] = useCookies(["access_tokens"]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    setCookies("access_tokens", "");
    window.localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getLinkClassName = (path) => 
    `flex items-center text-orange-800 hover:text-orange-600 transition-colors duration-300 ${
      location.pathname === path ? 'font-semibold' : ''
    }`;

  return (
    <nav className="bg-yellow-100 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-3xl font-extrabold text-orange-700 flex items-center space-x-2">
            <FaUtensils size={32} />
            <span className="font-cursive">Ethiopian Cuisine</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link className={getLinkClassName("/")} to="/">
              <FaHome className="mr-1" /> Home
            </Link>
            <Link className={getLinkClassName("/create-recipes")} to="/create-recipes">
              <FaUtensils className="mr-1" /> Create Recipes
            </Link>
            <Link className={getLinkClassName("/saved-recipes")} to="/saved-recipes">
              <FaBookmark className="mr-1" /> Saved Recipes
            </Link>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {!cookies.access_tokens ? (
            <>
              <Link className={getLinkClassName("/login")} to="/login">
                <FaSignInAlt className="mr-1" /> Login
              </Link>
              <Link className={getLinkClassName("/register")} to="/register">
                <FaUserPlus className="mr-1" /> Register
              </Link>
            </>
          ) : (
            <button className="flex items-center text-orange-800 hover:text-orange-600 transition-colors duration-300" onClick={logout}>
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          )}
        </div>
        <button className="md:hidden text-orange-800 hover:text-orange-600 transition-colors duration-300" onClick={handleMenuToggle}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-yellow-100 shadow-lg`}>
        <div className="px-6 py-4 flex flex-col space-y-4">
          <Link className={getLinkClassName("/")} to="/" onClick={handleMenuToggle}>
            <FaHome className="mr-1" /> Home
          </Link>
          <Link className={getLinkClassName("/create-recipes")} to="/create-recipes" onClick={handleMenuToggle}>
            <FaUtensils className="mr-1" /> Create Recipes
          </Link>
          <Link className={getLinkClassName("/saved-recipes")} to="/saved-recipes" onClick={handleMenuToggle}>
            <FaBookmark className="mr-1" /> Saved Recipes
          </Link>
          {!cookies.access_tokens ? (
            <>
              <Link className={getLinkClassName("/login")} to="/login" onClick={handleMenuToggle}>
                <FaSignInAlt className="mr-1" /> Login
              </Link>
              <Link className={getLinkClassName("/register")} to="/register" onClick={handleMenuToggle}>
                <FaUserPlus className="mr-1" /> Register
              </Link>
            </>
          ) : (
            <button className="flex items-center text-orange-800 hover:text-orange-600 transition-colors duration-300" onClick={() => { logout(); handleMenuToggle(); }}>
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
