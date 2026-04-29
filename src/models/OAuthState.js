const mongoose = require('mongoose');

const oauthStateSchema = new mongoose.Schema({
  state: { type: String, required: true, unique: true },
  code_verifier: { type: String, required: true },
  created_at: { type: Date, default: Date.now, expires: 300 }
});

module.exports = mongoose.model('OAuthState', oauthStateSchema);