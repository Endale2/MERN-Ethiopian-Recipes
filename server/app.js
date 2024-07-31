import express from "express"
import mongoose from "mongoose"
import { userRouter } from "./routes/user_routes.js"
import { recipesRouter } from "./routes/recipes_router.js"
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cors())

app.use('/auth', userRouter)
app.use("/recipes", recipesRouter)

mongoose.connect("mongodb://localhost:27017/Recipes").then(console.log("connected successfull")).catch(err=>console.log(err))
app.listen(5000, console.log("the server is running "))