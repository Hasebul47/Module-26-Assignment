import User from '../models/User.js';
import News from '../models/News.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, bio, avatar, password } = req.body;

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = password;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('updateUserProfile Error:', error);
    return res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

// @desc    Get user profile with authored articles stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userArticles = await News.find({ author: req.user._id });
    const totalArticles = userArticles.length;
    const totalViews = userArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        totalArticles,
        totalViews,
      },
    });
  } catch (error) {
    console.error('getUserStats Error:', error);
    return res.status(500).json({ message: error.message || 'Error fetching user stats' });
  }
};
