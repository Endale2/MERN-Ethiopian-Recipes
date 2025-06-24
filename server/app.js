import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import path from "path";

import "./config/passport.js";
import { authRouter } from "./routes/auth_router.js";
import { recipesRouter } from "./routes/recipes_router.js";

dotenv.config();
const app = express();

// ————————————————————————————————————————————————————————
// 1) Trust proxy (needed for secure cookies behind Render/Vercel)
// ————————————————————————————————————————————————————————
app.set("trust proxy", 1);

// ————————————————————————————————————————————————————————
// 2) Static uploads
// ————————————————————————————————————————————————————————
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ————————————————————————————————————————————————————————
// 3) Body parser
// ————————————————————————————————————————————————————————
app.use(express.json());

// ————————————————————————————————————————————————————————
// 4) CORS
// ————————————————————————————————————————————————————————
const allowedOrigins = [
  process.env.CLIENT_URL,                                                 // e.g. Vercel #1
  "https://ethiopian-cuisine-96a8l6oji-endale2s-projects.vercel.app"       // Vercel #2
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);        // allow non-browser clients
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  })
);

app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

// ————————————————————————————————————————————————————————
// 5) Session + Passport
// ————————————————————————————————————————————————————————
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ————————————————————————————————————————————————————————
// 6) Routes
// ————————————————————————————————————————————————————————
app.use("/auth", authRouter);
app.use("/recipes", recipesRouter);

// ————————————————————————————————————————————————————————
// 7) MongoDB Connect & Server start
// ————————————————————————————————————————————————————————
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err)
  );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
