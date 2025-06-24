import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

import './config/passport.js';
import { authRouter } from './routes/auth_router.js';
import { recipesRouter } from './routes/recipes_router.js';
import path from 'path';





dotenv.config();

const app = express();

// Serve static files from /uploads
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);
// Middleware
app.use(express.json());
cors({ origin: undefined, credentials: true })

app.use(
  session({
    name: 'sid',             // session cookie name
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRouter);
app.use('/recipes', recipesRouter);

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
