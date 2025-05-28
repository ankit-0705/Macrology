const mongoose = require('mongoose');
const { Schema } = mongoose;

const macroSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'userInfo', required: true }, // Reference to User
  food_name: { type: String, required: true }, // Can also be populated from foodIem
  foodId: { type: Schema.Types.ObjectId, ref: 'foodIem' }, // Optional link to original food doc
  energy_kcal: { type: Number, default: 0 },
  protein_g: { type: Number, default: 0 },
  fat_g: { type: Number, default: 0 },
  carb_g: { type: Number, default: 0 },
  meal: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
  date: { type: String, required: true } // Use ISO date string like "2025-05-28"
}, { timestamps: true });

module.exports = mongoose.model('macroLog', macroSchema);
