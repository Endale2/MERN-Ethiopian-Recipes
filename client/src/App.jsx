import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateRecipes from './pages/CreateRecipes';
import SavedRecipes from './pages/SavedRecipes';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-recipes" element={<CreateRecipes />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;