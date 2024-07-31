import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getUserId from '../hooks/getUserId';

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userId = getUserId();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/saved-recipes/${userId}`);
        setSavedRecipes(response.data.savedRecipes);
        console.log(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userId]);

  return (
    <div>
      <h1>Saved Recipes</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h1>{recipe.name}</h1>
            </div>
            <div className="instructions">{recipe.instruction}</div>
            <img src={recipe.imageURL} alt={recipe.name} />
            <p>{recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRecipes;
