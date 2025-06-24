import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-yellow-100 py-10 border-t border-yellow-200">
      <div className="container mx-auto px-6 text-center">
        {/* App Title and Description */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-orange-700 mb-4 font-serif">Ethiopian Cuisine</h2>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
            Bringing you the best recipes and cooking tips to make your meals delicious, authentic, and fun. Explore the rich flavors of Ethiopia!
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-orange-600 mb-4">Quick Links</h3>
          <div className="flex justify-center space-x-6 text-lg">
            <Link className="text-gray-800 hover:text-orange-700 transition-colors duration-300" to="/">Home</Link>
            <Link className="text-gray-800 hover:text-orange-700 transition-colors duration-300" to="/create-recipes">Create Recipes</Link>
            <Link className="text-gray-800 hover:text-orange-700 transition-colors duration-300" to="/saved-recipes">Saved Recipes</Link>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-orange-600 mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-6">
            <a className="text-orange-700 hover:text-orange-900 transition-colors duration-300" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="h-8 w-8" />
            </a>
            <a className="text-orange-700 hover:text-orange-900 transition-colors duration-300" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="h-8 w-8" />
            </a>
            <a className="text-orange-700 hover:text-orange-900 transition-colors duration-300" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="h-8 w-8" />
            </a>
            <a className="text-orange-700 hover:text-orange-900 transition-colors duration-300" href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <FaPinterest className="h-8 w-8" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-gray-600 text-sm mt-8">
          <p>&copy; {new Date().getFullYear()} Ethiopian Cuisine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;