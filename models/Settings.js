const mongoose = require('mongoose');

// Single-document settings store (always upserted by key)
const settingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
