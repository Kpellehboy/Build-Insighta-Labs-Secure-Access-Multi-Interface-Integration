const mongoose = require('mongoose');
const { v7: uuidv7 } = require('uuid');

const refreshTokenSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv7() },
  token: { type: String, required: true, unique: true },
  user_id: { type: String, ref: 'User', required: true },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);