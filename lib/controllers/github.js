const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { exchangeCodeForToken, getGitHubProfile } = require('../services/github');
const authenticate = require('../middleware/authenticate');

const oneDayInMs = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=?${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`);
  })
  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;

      const token = await exchangeCodeForToken(code);
      const profile = await getGitHubProfile(token);

      let user = await User.findByUsername(token);

      if (!user) {
        user = await User.insert({
          username: profile.login,
          email: profile.email,
          avatar: profile.avatar_url
        });
      }

      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day'
      });

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: oneDayInMs
        })
        .redirect('/api/v1/github/dashboard');
    } catch(e) {
      next(e);
    }
  })
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  })
  .delete('/callback', (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME).json({ success: true, message: 'Signed out Successfully' });
  });
