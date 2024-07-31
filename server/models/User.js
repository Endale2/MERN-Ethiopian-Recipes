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
    }
})


const UserModel = mongoose.model("Users", UserSchema)

export default UserModel 