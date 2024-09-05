const mongoose = require('mongoose');

const cityBudgetSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true,
  },
  food: {
    type: Number,
    required: true,
  },
  transportation: {
    type: Number,
    required: true,
  },
  housing: {
    type: Number,
    required: true,
  },
  utilities: {
    type: Number,
    required: true,
  },
  entertainment: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('CityBudget', cityBudgetSchema);