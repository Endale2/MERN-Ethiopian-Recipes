import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRecipes from "./pages/CreateRecipes";
import NavBar from "./components/NavBar";
import { Toaster } from 'react-hot-toast';
import SavedRecipes from "./pages/SavedRecipes";

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
        <Route path="/saved-recipes" element={<SavedRecipes />} />
      </Routes>
    </>
  );
}

export default App;
