import express from 'express';
import passport from 'passport';

export const authRouter = express.Router();

// Start OAuth
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback; Passport will set session cookie
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // authenticated, redirect to client
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);

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
