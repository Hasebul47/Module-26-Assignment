import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  PenSquare,
  Image as ImageIcon,
  Tag,
  ArrowLeft,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { newsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

const categories = [
  'Technology',
  'Politics',
  'Business',
  'Sports',
  'Entertainment',
  'Health',
  'World',
];

export const CreateEditNews = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    summary: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
    tags: '',
    isFeatured: false,
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // If in edit mode, fetch existing article
  useEffect(() => {
    if (isEditMode) {
      const fetchOriginalArticle = async () => {
        try {
          setLoading(true);
          const res = await newsAPI.getById(id);
          const article = res.data;

          // Check author authorization
          const authorId = article.author?._id || article.author;
          if (user && user._id !== authorId && user.role !== 'admin') {
            setErrorMessage('You are not authorized to edit this article.');
            return;
          }

          setFormData({
            title: article.title,
            category: article.category,
            summary: article.summary,
            content: article.content,
            imageUrl: article.imageUrl,
            tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
            isFeatured: Boolean(article.isFeatured),
          });
        } catch (err) {
          console.error('Failed to load article for editing:', err);
          setErrorMessage('Could not load existing article data.');
        } finally {
          setLoading(false);
        }
      };

      fetchOriginalArticle();
    }
  }, [id, isEditMode, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      setErrorMessage('Please fill in title, summary, and article content.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        imageUrl: formData.imageUrl.trim(),
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        isFeatured: formData.isFeatured,
      };

      if (isEditMode) {
        await newsAPI.update(id, payload);
        setStatusMessage('Article updated successfully!');
        setTimeout(() => {
          navigate(`/news/${id}`);
        }, 1200);
      } else {
        const res = await newsAPI.create(payload);
        setStatusMessage('Article published successfully to Chronicle!');
        setTimeout(() => {
          navigate(`/news/${res.data._id}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Error saving news:', err);
      setErrorMessage(
        err.response?.data?.message || 'Error occurred while saving article. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className="text-xs text-slate-400">
            Author: <strong className="text-slate-700">{user?.name}</strong>
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/30">
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <PenSquare className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-500">
                Editorial Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {isEditMode ? 'Edit News Dispatch' : 'Compose & Publish New Dispatch'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isEditMode
                ? 'Update headline, reporting content, or multimedia assets.'
                : 'Publish high quality, fact-checked reporting for Chronicle global readers.'}
            </p>
          </div>

          {/* Alert messages */}
          {statusMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl flex items-center gap-3 text-red-800 text-sm font-medium animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Headline / Title *
              </label>
              <input
                type="text"
                name="title"
                required
                maxLength={180}
                placeholder="Clear, authoritative headline (e.g., Breakthrough in Deep-Sea Oceanography...)"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-bold transition"
              />
              <span className="text-[11px] text-slate-400 mt-1 block text-right">
                {formData.title.length}/180
              </span>
            </div>

            {/* Category and Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 font-semibold text-slate-800 transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Tags (Comma-separated)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="tags"
                    placeholder="AI, Innovation, Climate, Markets"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
                  />
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold text-slate-800 cursor-pointer">
                Feature this story in prime homepage spotlights
              </label>
            </div>

            {/* Image URL with live preview */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Cover Photo URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="imageUrl"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* Live Preview Box */}
              {formData.imageUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center relative group">
                  <img
                    src={formData.imageUrl}
                    alt="Cover preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                    Image Preview
                  </span>
                </div>
              )}
            </div>

            {/* Summary / Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Executive Summary / Excerpt *
              </label>
              <textarea
                name="summary"
                rows="2"
                required
                maxLength={350}
                placeholder="A compelling 1-2 sentence overview of the article shown in preview cards..."
                value={formData.summary}
                onChange={handleChange}
                className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition leading-relaxed"
              ></textarea>
              <span className="text-[11px] text-slate-400 mt-1 block text-right">
                {formData.summary.length}/350
              </span>
            </div>

            {/* Full Body Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Full Article Content *
              </label>
              <textarea
                name="content"
                rows="10"
                required
                placeholder="Write your in-depth reporting here. Use double line breaks between paragraphs for clean editorial formatting..."
                value={formData.content}
                onChange={handleChange}
                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition leading-relaxed font-serif"
              ></textarea>
              <p className="text-[11px] text-slate-400 mt-1">
                Estimated read time will be automatically computed based on word count.
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 text-center transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-rose-600/30 transition duration-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {submitting
                    ? 'Publishing...'
                    : isEditMode
                    ? 'Update Article'
                    : 'Publish News Article'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
