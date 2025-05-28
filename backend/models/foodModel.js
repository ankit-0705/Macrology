const mongoose = require('mongoose')
const { Schema } = mongoose;

const foodSchema = new Schema({
  food_name: { type: String, required: true },
  energy_kcal: { type: Number, default: 0 },
  protein_g: { type: Number, default: 0 },
  fat_g: { type: Number, default: 0 },
  carb_g: { type: Number, default: 0 }
},{collection:'foods'});

module.exports = mongoose.model('foodIem',foodSchema);