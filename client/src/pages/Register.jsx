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
    <div>
      <h1>Register</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>Username:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password:</label>
        <input type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
