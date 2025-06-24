import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instruction: { type: String, required: true },
  imageURL: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  userOwner: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
});

export default mongoose.model('recipes', RecipeSchema);