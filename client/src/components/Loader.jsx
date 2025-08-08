import React from 'react';
import { FaUtensils, FaLeaf } from 'react-icons/fa';
import { GiCookingPot, GiKnifeFork } from 'react-icons/gi';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gradient-to-br from-ethiopian-50 via-white to-spice-50">
      <div className="text-center">
        <div className="relative mb-8">
          <GiCookingPot className="text-6xl text-ethiopian-500 animate-bounce-gentle" />
          <FaLeaf className="absolute -top-2 -right-2 text-2xl text-spice-500 animate-float" />
          <GiKnifeFork className="absolute -bottom-2 -left-2 text-xl text-ethiopian-400 animate-pulse-soft" />
        </div>
        <h2 className="text-2xl font-bold text-earth-800 mb-2">Preparing Your Experience</h2>
        <p className="text-earth-600 mb-4">Loading delicious Ethiopian recipes...</p>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-ethiopian-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-spice-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-ethiopian-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;