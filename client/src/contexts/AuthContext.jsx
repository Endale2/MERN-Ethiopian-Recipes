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
    // It's crucial that this URL matches your backend's Google OAuth initiation endpoint.
    // Ensure VITE_API_URL is correctly set in your .env file (e.g., VITE_API_URL=http://localhost:5000)
    const backendAuthUrl = `https://mern-ethiopian-recipes.vercel.app/auth/google`;
    console.log("Redirecting to backend for Google login:", backendAuthUrl);
    window.location.href = backendAuthUrl;
    // After redirection, the user will be sent to Google, then back to your backend,
    // and finally your backend should redirect them back to your frontend,
    // at which point the useEffect above will re-fetch the user status.
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