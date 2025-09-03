// schema/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  details: {
    type: {
      bio: {
        type: String,
        required: false,
        default: ''
      },
      gender: {
        type: String,
        required: false,
        default: null,
        enum: ['male', 'female', 'other']
      }
    },
    default: () => ({}) // 👈 Default for the entire `details` object
  },
  follow: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);