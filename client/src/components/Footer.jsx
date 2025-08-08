/* src/components/Footer.jsx */
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaHeart, FaLeaf } from 'react-icons/fa';
import { GiCookingPot } from 'react-icons/gi';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-ethiopian-50 via-white to-spice-50 border-t border-ethiopian-200">
      <div className="container-max px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Branding */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <GiCookingPot className="text-3xl text-ethiopian-500" />
                <FaLeaf className="absolute -top-1 -right-1 text-sm text-spice-500" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gradient">Ethiopian Cuisine</h2>
                <p className="text-sm text-earth-600">Authentic Flavors</p>
              </div>
            </div>
            <p className="text-earth-600 leading-relaxed max-w-md">
              Discover authentic Ethiopian recipes and culinary traditions—bringing the vibrant flavors, 
              rich spices, and cultural heritage of Ethiopia right to your kitchen.
            </p>
            <div className="flex items-center space-x-2 text-earth-500">
              <FaHeart className="text-red-500" />
              <span className="text-sm">Made with love for Ethiopian cuisine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-earth-800">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-earth-600 hover:text-ethiopian-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/create-recipes" 
                  className="text-earth-600 hover:text-ethiopian-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link 
                  to="/saved-recipes" 
                  className="text-earth-600 hover:text-ethiopian-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Saved Recipes
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-earth-600 hover:text-ethiopian-600 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-earth-800">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-10 h-10 bg-ethiopian-100 rounded-full flex items-center justify-center text-ethiopian-600 hover:bg-ethiopian-200 hover:text-ethiopian-700 transition-all duration-300 hover:scale-110"
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
                className="w-10 h-10 bg-ethiopian-100 rounded-full flex items-center justify-center text-ethiopian-600 hover:bg-ethiopian-200 hover:text-ethiopian-700 transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-10 h-10 bg-ethiopian-100 rounded-full flex items-center justify-center text-ethiopian-600 hover:bg-ethiopian-200 hover:text-ethiopian-700 transition-all duration-300 hover:scale-110"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Pinterest"
                className="w-10 h-10 bg-ethiopian-100 rounded-full flex items-center justify-center text-ethiopian-600 hover:bg-ethiopian-200 hover:text-ethiopian-700 transition-all duration-300 hover:scale-110"
              >
                <FaPinterest size={18} />
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-earth-600">Share your recipes with the world</p>
              <p className="text-sm text-earth-600">Join our growing community</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ethiopian-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-earth-600">
              &copy; {new Date().getFullYear()} Ethiopian Cuisine. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-earth-600">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Us</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
