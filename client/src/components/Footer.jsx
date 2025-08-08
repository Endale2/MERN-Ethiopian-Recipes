/* src/components/Footer.jsx */
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-yellow-100 via-orange-50 to-yellow-100 border-t border-orange-200 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        {/* Branding */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-orange-600">Ethiopian Cuisine</h2>
          <p className="text-sm leading-relaxed">
            Discover authentic Ethiopian recipes and culinary tips—bringing the vibrant flavors of Ethiopia right to your kitchen.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-orange-500 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-orange-600 transition">Home</Link>
            </li>
            <li>
              <Link to="/create-recipes" className="hover:text-orange-600 transition">Create Recipe</Link>
            </li>
            <li>
              <Link to="/saved-recipes" className="hover:text-orange-600 transition">Saved Recipes</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-orange-600 transition">Profile</Link>
            </li>
          </ul>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <div className="flex space-x-4 text-orange-600">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook size={20} className="hover:text-orange-700 transition" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter size={20} className="hover:text-orange-700 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={20} className="hover:text-orange-700 transition" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <FaPinterest size={20} className="hover:text-orange-700 transition" />
            </a>
          </div>
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Ethiopian Cuisine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
