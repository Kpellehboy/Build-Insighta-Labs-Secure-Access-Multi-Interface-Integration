const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { githubCallback, refreshToken, logout, getTokenByState } = require('../controllers/authController');

router.get('/github', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;
  console.log('Redirecting to GitHub with state:', state);
  res.redirect(authUrl);
});

router.get('/github/callback', githubCallback);
router.post('/github/callback', githubCallback);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/token', getTokenByState);

module.exports = router;