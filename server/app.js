import express from "express"
import mongoose from "mongoose"
import { userRouter } from "./routes/user_routes.js"
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cors())

app.use('/auth', userRouter)

mongoose.connect("mongodb+srv://endale406:lMnxA6EljBRohJas@cluster0.rs44wxp.mongodb.net/recipes?retryWrites=true&w=majority&appName=Cluster0").then(console.log("connected successfull")).catch(err=>console.log(err))
app.listen(5000, console.log("the server is running "))