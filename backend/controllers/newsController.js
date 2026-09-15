import News from '../models/News.js';

// Helper to calculate reading time
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const words = content ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${Math.max(1, minutes)} min read`;
};

// @desc    Get all news with filtering, search, pagination, and sorting
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 9 } = req.query;

    const query = {};

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Search query across title and summary
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { summary: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'popular' || sort === 'views') {
      sortOptions = { views: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'featured') {
      sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const totalNews = await News.countDocuments(query);
    const news = await News.find(query)
      .populate('author', 'name avatar bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.json({
      news,
      page: pageNum,
      pages: Math.ceil(totalNews / limitNum),
      totalNews,
    });
  } catch (error) {
    console.error('getNews Error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching news' });
  }
};

// @desc    Get top news (limit default: 6) for Homepage section
// @route   GET /api/news/top
// @access  Public
export const getTopNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const topNews = await News.find({})
      .populate('author', 'name avatar bio')
      .sort({ views: -1, isFeatured: -1, createdAt: -1 })
      .limit(limit);

    return res.json(topNews);
  } catch (error) {
    console.error('getTopNews Error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching top news' });
  }
};

// @desc    Get single news details & increment view count
// @route   GET /api/news/:id
// @access  Public
export const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar bio email');

    if (!newsItem) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Also fetch related news from the same category
    const relatedNews = await News.find({
      category: newsItem.category,
      _id: { $ne: newsItem._id },
    })
      .limit(3)
      .select('title summary imageUrl createdAt readTime views');

    return res.json({
      ...newsItem.toObject(),
      relatedNews,
    });
  } catch (error) {
    console.error('getNewsById Error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching news details' });
  }
};

// @desc    Create new news article
// @route   POST /api/news
// @access  Private
export const createNews = async (req, res) => {
  try {
    const { title, summary, content, category, imageUrl, tags, isFeatured } = req.body;

    if (!title || !summary || !content || !category) {
      return res.status(400).json({ message: 'Title, summary, content, and category are required' });
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const news = await News.create({
      title,
      summary,
      content,
      category,
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
      tags: parsedTags,
      isFeatured: Boolean(isFeatured),
      author: req.user._id,
      authorName: req.user.name,
      readTime: calculateReadTime(content),
    });

    return res.status(201).json(news);
  } catch (error) {
    console.error('createNews Error:', error);
    return res.status(500).json({ message: error.message || 'Error creating news' });
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private (Author or Admin)
export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Check authorization: must be author or admin
    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this article' });
    }

    const { title, summary, content, category, imageUrl, tags, isFeatured } = req.body;

    if (title) news.title = title;
    if (summary) news.summary = summary;
    if (content) {
      news.content = content;
      news.readTime = calculateReadTime(content);
    }
    if (category) news.category = category;
    if (imageUrl) news.imageUrl = imageUrl;
    if (tags) {
      news.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : news.tags;
    }
    if (isFeatured !== undefined) news.isFeatured = Boolean(isFeatured);

    const updatedNews = await news.save();
    return res.json(updatedNews);
  } catch (error) {
    console.error('updateNews Error:', error);
    return res.status(500).json({ message: error.message || 'Error updating news' });
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private (Author or Admin)
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    if (news.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await News.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Article removed successfully', id: req.params.id });
  } catch (error) {
    console.error('deleteNews Error:', error);
    return res.status(500).json({ message: error.message || 'Error deleting news' });
  }
};

// @desc    Get articles created by logged-in user
// @route   GET /api/news/user/my-news
// @access  Private
export const getMyNews = async (req, res) => {
  try {
    const myArticles = await News.find({ author: req.user._id }).sort({ createdAt: -1 });
    return res.json(myArticles);
  } catch (error) {
    console.error('getMyNews Error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching your articles' });
  }
};

// @desc    Add comment to an article
// @route   POST /api/news/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    const comment = {
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar,
      text: text.trim(),
      createdAt: new Date(),
    };

    news.comments.unshift(comment);
    await news.save();

    return res.status(201).json(news.comments);
  } catch (error) {
    console.error('addComment Error:', error);
    return res.status(500).json({ message: error.message || 'Error posting comment' });
  }
};
