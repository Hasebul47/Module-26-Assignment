import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  User,
  Eye,
  PenSquare,
  Trash2,
  ExternalLink,
  PlusCircle,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { newsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'articles';

  const { user, updateProfile } = useAuthStore();

  // Articles state
  const [myArticles, setMyArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile update state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    password: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // Load user articles
  const fetchUserArticles = async () => {
    try {
      setLoadingArticles(true);
      const res = await newsAPI.getMyNews();
      setMyArticles(res.data || []);
    } catch (err) {
      console.error('Failed to load user news:', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    fetchUserArticles();
  }, []);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        password: '',
      });
    }
  }, [user]);

  // Handle article delete
  const handleDeleteArticle = async (id) => {
    try {
      setIsDeleting(true);
      await newsAPI.delete(id);
      setMyArticles((prev) => prev.filter((a) => a._id !== id));
      setDeleteModalId(null);
    } catch (err) {
      console.error('Failed to delete news article:', err);
      alert('Failed to delete article. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle profile update submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    try {
      setProfileSaving(true);
      const payload = {
        name: profileData.name.trim(),
        bio: profileData.bio.trim(),
        avatar: profileData.avatar.trim(),
      };
      if (profileData.password && profileData.password.length >= 6) {
        payload.password = profileData.password;
      }

      const res = await updateProfile(payload);
      if (res.success) {
        setProfileMessage('Profile information successfully updated!');
        setProfileData((prev) => ({ ...prev, password: '' }));
        setTimeout(() => setProfileMessage(null), 4000);
      } else {
        setProfileError(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileError('An error occurred during update.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Total views calculated
  const totalViews = myArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="min-h-screen py-10 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt={user?.name || 'User'}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-rose-500/10 shadow-md flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    {user?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                    <ShieldCheck className="w-3 h-3" />
                    {user?.role || 'Journalist'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
                <p className="text-xs text-slate-600 mt-2 max-w-xl line-clamp-1 italic">
                  "{user?.bio || 'News writer and contributor'}"
                </p>
              </div>
            </div>

            <Link
              to="/create-news"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/25 transition duration-200"
            >
              <PenSquare className="w-4 h-4" />
              <span>Compose New Dispatch</span>
            </Link>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Articles Published</span>
                <FileText className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-display mt-1">
                {myArticles.length}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Cumulative Reads</span>
                <Eye className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-display mt-1">
                {totalViews.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Editorial Status</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-sm font-bold text-slate-800 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Active Contributor
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-8">
          <button
            onClick={() => setSearchParams({ tab: 'articles' })}
            className={`pb-4 px-2 text-sm font-bold transition flex items-center gap-2 border-b-2 -mb-[2px] ${
              activeTab === 'articles'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Articles ({myArticles.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'profile' })}
            className={`pb-4 px-2 text-sm font-bold transition flex items-center gap-2 border-b-2 -mb-[2px] ${
              activeTab === 'profile'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Account Settings</span>
          </button>
        </div>

        {/* Tab 1: Articles Management */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Dispatches Authored by You
              </h2>
              <span className="text-xs text-slate-500">
                You have full authority to edit or retract your stories.
              </span>
            </div>

            {loadingArticles ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-24 border border-slate-200 animate-pulse p-4"
                  ></div>
                ))}
              </div>
            ) : myArticles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">You haven't written any news yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Share your first journalistic report or breaking story with our global readers.
                </p>
                <Link
                  to="/create-news"
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-500 transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Write First Article</span>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {myArticles.map((article) => (
                    <div
                      key={article._id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {article.category}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link
                            to={`/news/${article._id}`}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-rose-600 transition line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {article.views || 0} reads
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {article.readTime || '3 min'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Edit & Delete */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          to={`/news/${article._id}`}
                          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit-news/${article._id}`}
                          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        >
                          <PenSquare className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => setDeleteModalId(article._id)}
                          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Update Form */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 font-display mb-1">
              Account & Editorial Profile
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Update your public byline credentials, bio, and account credentials.
            </p>

            {profileMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-medium animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-2xl flex items-center gap-3 text-red-800 text-sm font-medium animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Email address cannot be modified once registered.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={profileData.avatar}
                  onChange={(e) =>
                    setProfileData({ ...profileData, avatar: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Author Biography
                </label>
                <textarea
                  rows="3"
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  placeholder="Describe your journalistic beat or research background..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave empty to keep existing password"
                  value={profileData.password}
                  onChange={(e) =>
                    setProfileData({ ...profileData, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition duration-200 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Delete This Article?
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This action cannot be undone. The story and all associated comments will be permanently erased from the portal.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteModalId)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
