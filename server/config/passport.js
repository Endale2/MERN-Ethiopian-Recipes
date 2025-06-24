import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/User.js';

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });
        if (!user) {
          user = await UserModel.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            photoURL: profile.photos[0].value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

