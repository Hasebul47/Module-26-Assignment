import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight, X, Newspaper } from 'lucide-react';
import { newsAPI } from '../services/api';
import { NewsCard } from '../components/NewsCard';

const categories = [
  'All',
  'Technology',
  'Politics',
  'Business',
  'Sports',
  'Entertainment',
  'Health',
  'World',
];

export const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [newsList, setNewsList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Synchronize state when URL query params change
  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) setSelectedCategory(urlCat);

    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) setSearch(urlSearch);

    const urlSort = searchParams.get('sort');
    if (urlSort) setSortBy(urlSort);

    const urlPage = parseInt(searchParams.get('page'), 10);
    if (urlPage) setPage(urlPage);
  }, [searchParams]);

  // Fetch news data
  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        sort: sortBy,
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(search.trim() !== '' && { search: search.trim() }),
      };

      const res = await newsAPI.getAll(params);
      setNewsList(res.data.news || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.totalNews || 0);
    } catch (err) {
      console.error('Error fetching all news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, sortBy, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (search.trim()) {
      newParams.set('search', search.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
    fetchNews();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Newspaper className="w-5 h-5 text-rose-600" />
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500 font-display">
              Chronicle Archives
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            Global News Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse verified coverage across {totalItems} published dispatches worldwide.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
          {/* Search bar row */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search articles by title, tags, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    setSearchParams(newParams);
                  }}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-slate-50 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Viewed</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}

            {(selectedCategory !== 'All' || search || sortBy !== 'newest') && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-2 whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <span>
            Showing <strong>{newsList.length}</strong> of <strong>{totalItems}</strong> articles
            {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
            {search && ` matching "${search}"`}
          </span>
          <span>Page {page} of {totalPages}</span>
        </div>

        {/* Articles List / Grid */}
        {loading ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-4'
            }
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-80 border border-slate-200 animate-pulse p-4"
              ></div>
            ))}
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No news articles found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try modifying your keywords or clearing category filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 bg-rose-600 text-white rounded-full text-xs font-semibold hover:bg-rose-500 transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((item) => (
              <NewsCard key={item._id} news={item} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {newsList.map((item) => (
              <NewsCard key={item._id} news={item} variant="horizontal" />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-semibold transition ${
                    page === pageNum
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
