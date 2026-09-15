import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, User, ArrowUpRight } from 'lucide-react';

const categoryColors = {
  Technology: 'bg-blue-50 text-blue-700 border-blue-200',
  Business: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Politics: 'bg-rose-50 text-rose-700 border-rose-200',
  Sports: 'bg-amber-50 text-amber-700 border-amber-200',
  Entertainment: 'bg-purple-50 text-purple-700 border-purple-200',
  Health: 'bg-teal-50 text-teal-700 border-teal-200',
  World: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export const NewsCard = ({ news, variant = 'grid' }) => {
  if (!news) return null;

  const categoryStyle =
    categoryColors[news.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  const formattedDate = new Date(news.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const authorName = news.author?.name || news.authorName || 'Staff Reporter';
  const authorAvatar =
    news.author?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  // Horizontal variant (used in lists or sidebars)
  if (variant === 'horizontal') {
    return (
      <Link
        to={`/news/${news._id}`}
        className="group flex flex-col sm:flex-row gap-5 p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300"
      >
        <div className="sm:w-56 h-48 sm:h-auto rounded-xl overflow-hidden relative flex-shrink-0 bg-slate-100">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${categoryStyle}`}
          >
            {news.category}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>•</span>
              <span>{news.readTime || '3 min read'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {news.views || 0} views
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
              {news.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {news.summary}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="text-xs font-medium text-slate-700">{authorName}</span>
            </div>
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Read <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default Grid Card
  return (
    <Link
      to={`/news/${news._id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${categoryStyle}`}
        >
          {news.category}
        </span>
        {news.isFeatured && (
          <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{news.readTime || '3 min read'}</span>
            <span className="ml-auto flex items-center gap-1 font-medium text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              {news.views || 0}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug font-display">
            {news.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {news.summary}
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
              {authorName}
            </span>
          </div>
          <span className="text-xs font-semibold text-rose-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
