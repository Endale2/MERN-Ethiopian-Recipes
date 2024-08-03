import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    savedRecipes: [{
        type: mongoose.Types.ObjectId,
        ref: "recipes",
    }],
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
