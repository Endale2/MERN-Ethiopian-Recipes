import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/user_routes.js";
import { recipesRouter } from "./routes/recipes_router.js";
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', userRouter);
app.use('/recipes', recipesRouter);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log("MongoDB connection error:", err));


app.listen(5000, () => {
  console.log("The server is running on port 5000");
});
