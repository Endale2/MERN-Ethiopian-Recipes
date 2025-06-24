import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  savedRecipes: [{ type: mongoose.Types.ObjectId, ref: 'recipes' }],
});

export default mongoose.model('users', UserSchema);