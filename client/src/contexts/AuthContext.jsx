import React, { createContext, useState, useEffect } from 'react';
import api from '../axiosConfig'; 
import { useNavigate } from 'react-router-dom'; 
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    // This effect runs once on component mount to check the current authentication status
    // by calling your backend's /auth/user endpoint.
    api.get('/auth/user')
      .then(r => {
        if (r.data.user) {
          setUser(r.data.user);
        } else {
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Error checking user session:", error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []); // Empty dependency array means it runs once on mount

  // Function to initiate Google login.
  // This assumes your backend has an endpoint like /auth/google
  // that handles the OAuth redirection.
  const login = () => {
  window.location.href = 'https://mern-ethiopian-recipes.onrender.com/auth/google';
};


  const logout = () => {
    api.get('/auth/logout')
      .then(() => {
        setUser(null);
        // Optionally navigate to home or login page after logout
        navigate('/'); 
      })
      .catch(error => {
        console.error("Error logging out:", error);
        // Even if logout fails on server, clear client-side user
        setUser(null); 
      });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}