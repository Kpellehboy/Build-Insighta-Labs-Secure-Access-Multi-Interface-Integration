const mongoose = require('mongoose');

const authSessionSchema = new mongoose.Schema({
  state: { type: String, required: true, unique: true },
  access_token: { type: String },
  refresh_token: { type: String },
  created_at: { type: Date, default: Date.now, expires: 120 }
});

module.exports = mongoose.model('AuthSession', authSessionSchema);