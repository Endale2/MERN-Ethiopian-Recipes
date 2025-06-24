import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRecipes from "./pages/CreateRecipes";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetail from "./pages/RecipeDetail";
import Profile from "./pages/Profile";  // new
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <>
      <Toaster />
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-recipes" element={<CreateRecipes />} />
        <Route path="/saved-recipes" element={<SavedRecipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/profile" element={<Profile />} />   
      </Routes>

      <Footer />
    </>
  );
}

export default App;