import express from 'express';
import {
  getNews,
  getTopNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getMyNews,
  addComment,
} from '../controllers/newsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Specific routes before param :id
router.get('/top', getTopNews);
router.get('/user/my-news', protect, getMyNews);

// General collections
router.get('/', getNews);
router.post('/', protect, createNews);

// Item specific
router.get('/:id', getNewsById);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);
router.post('/:id/comments', protect, addComment);

export default router;
