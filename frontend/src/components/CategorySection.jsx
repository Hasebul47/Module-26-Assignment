import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsAPI } from '../services/api';
import { NewsCard } from './NewsCard';

const categories = [
  'All',
  'Technology',
  'Politics',
  'Business',
  'Sports',
  'Entertainment',
  'Health',
];

export const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState('Technology');
  const [categoryNews, setCategoryNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 4,
          ...(activeCategory !== 'All' && { category: activeCategory }),
        };
        const res = await newsAPI.getAll(params);
        setCategoryNews(res.data.news || []);
      } catch (err) {
        console.error('Category news error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [activeCategory]);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Section 3 • Topic Explorer
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Curated Category Focus
          </h2>
        </div>

        <Link
          to={`/news?category=${activeCategory !== 'All' ? activeCategory : ''}`}
          className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          View all {activeCategory} news <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 border border-slate-200 animate-pulse p-4"></div>
          ))}
        </div>
      ) : categoryNews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No articles found in this category currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryNews.map((item) => (
            <NewsCard key={item._id} news={item} />
          ))}
        </div>
      )}
    </section>
  );
};
