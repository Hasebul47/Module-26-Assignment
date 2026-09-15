import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    text: {
      type: String,
      required: [true, 'Comment text cannot be empty'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an article title'],
      trim: true,
      maxlength: [180, 'Title cannot exceed 180 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Please provide a brief summary / excerpt'],
      maxlength: [350, 'Summary cannot exceed 350 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    category: {
      type: String,
      required: [true, 'Please choose a category'],
      enum: ['Technology', 'Politics', 'Business', 'Sports', 'Entertainment', 'Health', 'World'],
      default: 'Technology',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide a featured image URL'],
      default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      default: 'Chronicle Staff',
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: '3 min read',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// Text indexes for rapid search
newsSchema.index({ title: 'text', summary: 'text', content: 'text' });

const News = mongoose.model('News', newsSchema);
export default News;
