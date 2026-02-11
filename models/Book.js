const mongoose = require('mongoose');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    maxlength: [5000, 'Review cannot exceed 5000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  coverImage: {
    type: String,
    trim: true
  },
  genre: [{
    type: String,
    trim: true
  }],
  readingStatus: {
    type: String,
    enum: ['reading', 'completed', 'want-to-read'],
    default: 'completed'
  },
  startedReading: {
    type: Date
  },
  finishedReading: {
    type: Date
  },
  favorite: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  published: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate slug before saving
bookSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('author')) {
    this.slug = slugify(`${this.title} ${this.author}`, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
