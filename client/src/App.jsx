import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRecipes from "./pages/CreateRecipes";
import NavBar from "./components/NavBar";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
     <Toaster />
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/create-recipes" element={<CreateRecipes />} />
      </Routes>
    </>
  );
}

export default App;
