import mongoose from 'mongoose';

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
  userOwner: {
    type: mongoose.Types.ObjectId,
    ref: "users",  // Ensure this matches the model name
    required: true
  }
});

const RecipeModel = mongoose.model("recipes", RecipeSchema);

export default RecipeModel;
