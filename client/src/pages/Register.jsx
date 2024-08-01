import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault(); // Correctly prevent default behavior
    try {
      const response = await axios.post("http://localhost:5000/auth/register", { username, password });
      
      // Check if the response contains an error message
      if (response.data.message_exist) {
        toast.error(response.data.message_exist); // Display error toast for existing user
      } else {
        toast.success(response.data.message || "Registration successful!"); // Display success toast
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred"); // Display error toast for network errors or server issues
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
