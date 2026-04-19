const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  meter: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  lastTokenId: { type: Number, default: 0 },
  lastToken: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});

const readingSchema1 = new mongoose.Schema({
  meter: { type: String, required: true},
  amount: { type: Number, required: true },
  token: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Reading = mongoose.model('Reading', readingSchema);
const Tokens = mongoose.model('Tokens', readingSchema1);

module.exports = {
  Reading,
  Tokens
}
