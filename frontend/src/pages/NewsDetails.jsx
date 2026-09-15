import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Eye,
  Calendar,
  Share2,
  Bookmark,
  MessageSquare,
  ArrowLeft,
  Send,
  Check,
  User as UserIcon,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { newsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { NewsCard } from '../components/NewsCard';

export const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment form state
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await newsAPI.getById(id);
        setArticle(res.data);
      } catch (err) {
        console.error('Error fetching single news details:', err);
        setError('Article could not be found or has been moved.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const res = await newsAPI.addComment(id, commentText.trim());
      setArticle((prev) => ({
        ...prev,
        comments: res.data,
      }));
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Unable to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 max-w-4xl mx-auto px-4 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-12 w-full bg-slate-200 rounded-2xl mb-4"></div>
        <div className="h-6 w-2/3 bg-slate-200 rounded mb-8"></div>
        <div className="h-96 w-full bg-slate-200 rounded-3xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-14 h-14 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Article Unavailable</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-md">{error}</p>
        <Link
          to="/news"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-full text-xs font-semibold hover:bg-rose-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All News
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const authorName = article.author?.name || article.authorName || 'Staff Reporter';
  const authorAvatar =
    article.author?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
  const authorBio =
    article.author?.bio || 'Chronicle international news bureau correspondent.';

  return (
    <article className="min-h-screen py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to previous
          </button>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/news?category=${article.category}`}
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
            >
              {article.category}
            </Link>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime || '3 min read'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {article.views || 0} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-serif leading-relaxed italic border-l-4 border-rose-500 pl-4 py-1">
            "{article.summary}"
          </p>

          {/* Author bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{authorName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              {user && (user._id === article.author?._id || user._id === article.author) && (
                <Link
                  to={`/edit-news/${article._id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-rose-600 transition"
                >
                  Edit Article
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden mb-10 shadow-lg shadow-slate-200/50 bg-slate-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full max-h-[500px] object-cover"
          />
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
            <span className="text-[11px] text-slate-400">
              Photo: Chronicle International Editorial Archives
            </span>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none mb-12">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className={`text-slate-800 text-base sm:text-lg leading-relaxed mb-6 font-serif ${
                index === 0 ? 'editorial-dropcap' : ''
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="py-6 border-y border-slate-100 flex flex-wrap items-center gap-2 mb-10">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-2">
              <Tag className="w-3.5 h-3.5 text-rose-600" />
              Article Topics:
            </span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/news?search=${tag}`}
                className="px-3 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 mb-14 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-sm flex-shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600">
              About the Author
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{authorName}</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {authorBio}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Reader Discussion ({article.comments ? article.comments.length : 0})
            </h3>
          </div>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-10">
              <div className="flex gap-3 items-start">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <textarea
                    rows="3"
                    required
                    placeholder="Contribute your perspective to this story..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingComment ? 'Submitting...' : 'Post Comment'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center mb-10">
              <p className="text-sm text-slate-600">
                You must be signed in to participate in the editorial discussion.
              </p>
              <Link
                to="/login"
                className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-rose-600 text-white rounded-full text-xs font-semibold transition"
              >
                Sign In to Comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comment, i) => (
                <div
                  key={comment._id || i}
                  className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          comment.avatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={comment.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-800">{comment.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9">
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400 italic">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </section>

        {/* Related Stories */}
        {article.relatedNews && article.relatedNews.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 font-display mb-6">
              More Stories in {article.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {article.relatedNews.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/news/${rel._id}`}
                  className="group block bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition"
                >
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="p-4">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {rel.readTime || '3 min'} • {rel.views || 0} views
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
