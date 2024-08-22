import express from 'express';
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken'


const router = express.Router()

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
     
      const user = await UserModel.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "This user already exists" }); 
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" }); 
    } catch (error) {
      
      res.status(500).json({ message: "An error occurred during registration" }); 
    }
  });




  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "The user does not exist" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "The password or username is incorrect" });
      }
  
      if (isPasswordValid) {
        const token = jwt.sign({ id: user._id }, "secret");
        return res.status(200).json({ token, user, message: "The user logged in successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  });
  



export {router as userRouter};