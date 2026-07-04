const mongoose = require('mongoose');

const bookEntrySchema = new mongoose.Schema({
  title:  { type: String, trim: true },
  author: { type: String, trim: true },
  note:   { type: String, trim: true }
}, { _id: false });

const nowCardSchema = new mongoose.Schema({
  tag:       { type: String, trim: true, maxlength: 40, default: 'Now' },
  label:     { type: String, trim: true, maxlength: 80, default: '' },
  title:     { type: String, required: true, trim: true, maxlength: 120 },
  body:      [{ type: String, trim: true }],   // array of paragraphs
  books:     [bookEntrySchema],                // optional book list
  featured:  { type: Boolean, default: false }, // span full width
  order:     { type: Number, default: 0 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('NowCard', nowCardSchema);
