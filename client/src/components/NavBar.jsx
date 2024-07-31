import React from 'react';
import { Link } from 'react-router-dom';
import "../App.css"
import {useCookies } from"react-cookie"
import { useNavigate} from "react-router-dom"

function NavBar() {
  const [cookies, setCookies] = useCookies(["access_tokens"])
  const navigate = useNavigate()

  const logout=()=>{
    setCookies("access_tokens","")
    window.localStorage.removeItem("userId")
    navigate("/login")
  }

  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/create-recipes">Create Recipes</Link>
      <Link to="/saved-recipes">Saved Recipes</Link>
      { !cookies.access_tokens?(
        <>
      <Link to="/Login">Login</Link>
      <Link to="/Register">Register</Link>
      </>
      ):(<button onClick={logout}>Logout</button>)
     }
    </div>
  );
}

export default NavBar;
