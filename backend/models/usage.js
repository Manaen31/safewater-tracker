const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now },
  litersUsed: Number,
});

module.exports = mongoose.model('Usage', usageSchema);