import mongoose from "mongoose";


const UserSchema = mongoose.Schema({
    username:{
        type:String,
        unique: true,
        requires: true,
    },
    password:{
        type:String,
        requires: true,
    },
    savedRecipes:[{
        type:mongoose.Types.ObjectId, ref:"recipes"
    }]
})


const UserModel = mongoose.model("Users", UserSchema)

export default UserModel 