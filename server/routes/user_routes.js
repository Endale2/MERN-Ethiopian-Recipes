import express from 'express';
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken'


const router = express.Router()


router.post('/register', async(req,res)=>{
    const {username, password} = req.body

    const user = await UserModel.findOne({username})
    if(user){
        res.json({message:"This user is already exist"})
    }

   if (!user) {const hashedPassword = await bcrypt.hash(password, 10)
     

    const newUser = new UserModel({ username, password:hashedPassword})
    await newUser.save()

    res.json({message:"usser registered successfully"})}
})

router.post("/login",  async(req,res)=>{
    const {username, password} = req.body

    const user = await UserModel.findOne({username})
    if (!user){
       return res.json({message:" The user is not exist"})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid){
       return res.json({message:" the password or username is incorrect"})
    }

    if (isPasswordValid){
     const token = jwt.sign({id:user._id}, "secret");
     return  res.json({token, user, message:"The user logged in successfully"})

    }
})





export {router as userRouter};