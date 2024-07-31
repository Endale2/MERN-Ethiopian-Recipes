import React, { useState } from 'react';
import axios from 'axios';
import getUserId from '../hooks/getUserId';
import { useNavigate } from 'react-router-dom';

function CreateRecipes() {
  const userId = getUserId();
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [""],
    instruction: "",
    imageURL: "",
    cookingTime: 0,
    userOwner:userId
  });

  const navigate=useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
   try{ const response = await axios.post("http://localhost:5000/recipes", recipe)
    console.log(response)
    navigate("/")
  }
    catch(err){
      console.log(err)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = e.target.value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  return (
    <div>
      <h1>Create Recipes</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients:</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addIngredient}>Add Ingredient</button>
        </div>
        <div>
          <label htmlFor="instruction">Instruction:</label>
          <textarea
            id="instruction"
            name="instruction"
            value={recipe.instruction}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="imageURL">Image URL:</label>
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            value={recipe.imageURL}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cookingTime">Cooking Time (in minutes):</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
}

export default CreateRecipes;
