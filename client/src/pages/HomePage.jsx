import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getUserId from '../hooks/getUserId';

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const userId = getUserId();
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recipes");
        setRecipes(response.data);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/saved-recipes/${userId}`);
        setSavedRecipes(response.data.savedRecipes);
        console.log(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userId]);

  const saveRecipe = async (recipeId) => {
    try {
      const response = await axios.put("http://localhost:5000/recipes", { recipeId, userId });
      console.log(response);
      alert("The recipe is saved");

      // Refresh saved recipes after saving a new one
      const savedResponse = await axios.get(`http://localhost:5000/recipes/saved-recipes/${userId}`);
      setSavedRecipes(savedResponse.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (recipeId) => {
    return savedRecipes.some((savedRecipe) => savedRecipe._id === recipeId);
  };

  return (
    <div>
      <h1>HomePage</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h1>{recipe.name}</h1>
            </div>
            <div className="instructions">{recipe.instruction}</div>
            <img src={recipe.imageURL} alt={recipe.name} />
            <p>{recipe.cookingTime} minutes</p>

            {isRecipeSaved(recipe._id) ? (
              <button disabled>Saved</button>
            ) : (
              <button onClick={() => saveRecipe(recipe._id)}>Save</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
