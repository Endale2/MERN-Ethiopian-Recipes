import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRecipes from "./pages/CreateRecipes";
import NavBar from "./components/NavBar";
import { Toaster } from 'react-hot-toast';
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetail from "./pages/RecipeDetail"; // Import the RecipeDetail component
import Footer from "./components/Footer";
import './index.css';

function App() {
  return (
    <>
      <Toaster />
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-recipes" element={<CreateRecipes />} />
        <Route path="/saved-recipes" element={<SavedRecipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} /> {/* Ensure this matches the backend route */}
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;
