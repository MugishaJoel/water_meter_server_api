const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  meter: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  lastTokenId: { type: Number, default: 0 },
  lastToken: { type: String, default: null }, // ✅ NEW FIELD
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reading', readingSchema);
