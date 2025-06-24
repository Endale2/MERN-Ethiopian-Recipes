// src/components/LoginModal.jsx
import React from 'react';
import { FaTimes, FaGoogle } from 'react-icons/fa';

const LoginModal = ({ show, onClose, onLogin }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative transform scale-95 opacity-0 animate-fade-in-up-modal" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        <div className="text-center">
          <div className="mb-6">
            <FaGoogle className="mx-auto text-orange-500 text-6xl mb-4" />
            <h3 className="text-3xl font-extrabold text-gray-900 font-playfair-display">Join Our Culinary Community!</h3>
            <p className="mt-3 text-gray-600 text-lg">Sign in to save your favorite recipes, share your creations, and more.</p>
          </div>
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center space-x-3 bg-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          >
            <FaGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </button>
          <p className="mt-5 text-sm text-gray-500">
            By signing in, you agree to our <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;