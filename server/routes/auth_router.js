import express from 'express';
import passport from 'passport';

export const authRouter = express.Router();

// Start OAuth
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback; Passport will set session cookie
authRouter.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    if (err) {
      console.error("🔥 Passport error:", err);
      return next(err);              // send to your error handler
    }
    if (!user) {
      console.warn("⚠️ No user returned:", info);
      return res.redirect('/auth/failure');
    }
    // Manually establish the session
    req.logIn(user, loginErr => {
      if (loginErr) {
        console.error("🔥 req.logIn error:", loginErr);
        return next(loginErr);
      }
      // Success! Redirect to frontend
      return res.redirect(process.env.CLIENT_URL);
    });
  })(req, res, next);
});


authRouter.get('/failure', (req, res) => {
  res.status(401).json({ message: 'Authentication Failed' });
});

// Logout: destroy session cookie
authRouter.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: 'Logout Error' });
    req.session.destroy(() => {
      res.clearCookie('sid');
      res.redirect(`${process.env.CLIENT_URL}`);

    });
  });
});

// Get current user
authRouter.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: req.user });
});
