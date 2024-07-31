import mongoose from "mongoose";
import express from "express";

const RecipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [{ type: String, required: true }],

  instruction: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  userOwner:{
    type:mongoose.Types.ObjectId,
    ref: "users",
    required:true
  }
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);

export default RecipeModel;
