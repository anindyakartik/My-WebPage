const mongoose = require('mongoose');
const slugify = require('slugify');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
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
    required: [true, 'Content is required'],
    maxlength: [50000, 'Content cannot exceed 50000 characters']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  coverImage: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['tech', 'life', 'poetry', 'thoughts', 'tutorial', 'other'],
    default: 'thoughts'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number, // in minutes
    default: 5
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

// Generate slug, excerpt, and read time before saving
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('content')) {
    if (!this.excerpt) {
      this.excerpt = this.content.substring(0, 300) + '...';
    }
    // Calculate read time (average 200 words per minute)
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
