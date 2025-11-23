const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  ts: { type: Date, default: Date.now },
  ua: String,
  ip: String
}, { _id: false });

const LinkSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  url: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  clicks: [ClickSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Link', LinkSchema);