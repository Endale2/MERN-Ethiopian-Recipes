import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import path from 'path';

import './config/passport.js';
import { authRouter } from './routes/auth_router.js';
import { recipesRouter } from './routes/recipes_router.js';

dotenv.config();
const app = express();

// ————————————————————————————————————————————————————————
// 1) Ensure CLIENT_URL is set
// ————————————————————————————————————————————————————————
const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) {
  console.error("❌  CLIENT_URL is not defined in your environment!");
}

// ————————————————————————————————————————————————————————
// 2) Middleware: JSON, CORS (with preflight), Sessions, Passport
// ————————————————————————————————————————————————————————

// Parse JSON bodies
app.use(express.json());

// CORS: allow your frontend to call this API with credentials
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));

// Handle preflight ALL routes
app.options('*', cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Session + Cookie setup
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // must be HTTPS in prod
    sameSite: 'none',                               // allow cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,                // 7 days
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// ————————————————————————————————————————————————————————
// 3) Static /uploads
// ————————————————————————————————————————————————————————
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);

// ————————————————————————————————————————————————————————
// 4) Routes
// ————————————————————————————————————————————————————————
app.use('/auth', authRouter);
app.use('/recipes', recipesRouter);

// ————————————————————————————————————————————————————————
// 5) Connect Mongo & Start Server
// ————————————————————————————————————————————————————————
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
