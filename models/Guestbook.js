const mongoose = require('mongoose');

const guestbookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [60, 'Name cannot exceed 60 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [280, 'Message cannot exceed 280 characters']
  },
  // Optional: where they're from — feels personal
  location: {
    type: String,
    trim: true,
    maxlength: [60, 'Location cannot exceed 60 characters'],
    default: ''
  },
  // Admin can hide spam without deleting
  approved: {
    type: Boolean,
    default: true
  },
  // IP stored for spam protection only, never exposed publicly
  ip: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guestbook', guestbookSchema);
