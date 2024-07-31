import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie'

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const [_, setCookies] = useCookies(["access_tokens"])



  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { username, password });

      setCookies("access_tokens", response.data.token);
      window.localStorage.setItem("userId",response.data.user._id);

      // Access response data properly
      toast.success(response.data.message || "Login successful");
      navigate('/');
    } catch (error) {
      // Handle errors properly
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form className="form" onSubmit={handleLogin}> {/* Attach handleLogin to onSubmit */}
        <label>Username:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
