import React from 'react';
import { FaUtensils } from 'react-icons/fa'; // Example icon

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-orange-600">
      <div className="relative flex items-center justify-center">
        <FaUtensils className="text-6xl animate-bounce-slow" />
        <div className="absolute w-20 h-20 border-4 border-t-4 border-orange-200 border-solid rounded-full animate-spin-slow"></div>
      </div>
      <p className="mt-6 text-2xl font-semibold animate-pulse text-gray-700">Whipping up something delicious...</p>
      <p className="text-md text-gray-500 mt-2">Please wait a moment.</p>
    </div>
  );
};

export default Loader;