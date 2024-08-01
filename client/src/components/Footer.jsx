import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-yellow-100 py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-700 mb-4">Ethiopian Cuisine</h2>
          <p className="text-gray-700 mb-4">
            Bringing you the best recipes and cooking tips to make your meals delicious and fun.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Quick Links</h3>
          <div className="flex justify-center space-x-4">
            <Link className="text-gray-800 hover:text-gray-600 transition-colors duration-300" to="/">Home</Link>
            <Link className="text-gray-800 hover:text-gray-600 transition-colors duration-300" to="/create-recipes">Create Recipes</Link>
            <Link className="text-gray-800 hover:text-gray-600 transition-colors duration-300" to="/saved-recipes">Saved Recipes</Link>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Follow Us</h3>
          <div className="flex justify-center space-x-4">
            <a className="text-gray-800 hover:text-gray-600 transition-colors duration-300" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a className="text-gray-800 hover:text-gray-600 transition-colors duration-300" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a className="text-gray-800 hover:text-gray-600 transition-colors duration-300" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="h-6 w-6" />
            </a>
            <a className="text-gray-800 hover:text-gray-600 transition-colors duration-300" href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
              <FaPinterest className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Ethiopian Cuisine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
