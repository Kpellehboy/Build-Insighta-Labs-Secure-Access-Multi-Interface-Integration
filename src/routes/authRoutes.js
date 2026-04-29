const express = require('express');
const router = express.Router();
const { githubCallback, refreshToken, logout, getTokenByState } = require('../controllers/authController');
const OAuthState = require('../models/OAuthState');

// Redirect to GitHub or start OAuth for CLI
router.get('/github', async (req, res) => {
  const { state, code_challenge, code_verifier, cli } = req.query;
  if (state && code_verifier) {
    await OAuthState.create({ state, code_verifier });
  }
  if (cli === '1') {
    // CLI flow: send HTML page that auto-redirects to GitHub
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL)}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`;
    res.send(`
      <html><body>
        <p>Redirecting to GitHub...</p>
        <script>window.location.href='${authUrl}';</script>
      </body></html>
    `);
  } else {
    // Web portal flow: redirect directly
    let authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL)}`;
    if (state) authUrl += `&state=${state}`;
    if (code_challenge) authUrl += `&code_challenge=${code_challenge}&code_challenge_method=S256`;
    res.redirect(authUrl);
  }
});

router.get('/github/callback', githubCallback);
router.post('/github/callback', githubCallback);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/token', getTokenByState);

module.exports = router;