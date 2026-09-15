import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsAPI } from '../services/api';
import { NewsCard } from './NewsCard';

export const TopNewsSection = () => {
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopNews = async () => {
      try {
        setLoading(true);
        // Explicit API call to fetch top 6 news
        const res = await newsAPI.getTop(6);
        setTopNews(res.data);
      } catch (err) {
        console.error('Failed to fetch top news:', err);
        setError('Unable to load top stories at this moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopNews();
  }, []);

  return (
    <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Section 2 • Top 6 Most Read Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Trending Global Headlines
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              The six most viewed and critically acclaimed journalism pieces selected across all international editorial desks.
            </p>
          </div>

          <Link
            to="/news?sort=popular"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 transition"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse h-80 flex flex-col justify-between"
              >
                <div className="bg-slate-200 h-44 rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-slate-200 h-4 rounded w-3/4"></div>
                  <div className="bg-slate-200 h-3 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topNews.slice(0, 6).map((newsItem) => (
              <NewsCard key={newsItem._id} news={newsItem} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
