const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pnum: { type: Number, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('userInfo', userSchema);