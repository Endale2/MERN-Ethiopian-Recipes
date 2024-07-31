import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css"

function NavBar() {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/create-recipes">Create Recipes</Link>
      <Link to="/Login">Login</Link>
      <Link to="/Register">Register</Link>
    </div>
  );
}

export default NavBar;
