const mongoose = require('mongoose');
const slugify = require('slugify');

const poemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Poem title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Poem content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  mood: {
    type: String,
    enum: ['melancholic', 'joyful', 'contemplative', 'romantic', 'dark', 'hopeful', 'other'],
    default: 'contemplative'
  },
  featured: {
    type: Boolean,
    default: false
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

// Generate slug and excerpt before saving
poemSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }
  next();
});

module.exports = mongoose.model('Poem', poemSchema);
