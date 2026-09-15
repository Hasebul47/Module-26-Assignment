import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Sparkles, ArrowRight } from 'lucide-react';

export const HeroSection = ({ news = [] }) => {
  if (!news || news.length === 0) return null;

  const mainStory = news[0];
  const sideStories = news.slice(1, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
        <h2 className="text-xs font-bold tracking-widest uppercase text-slate-500 font-display">
          Editorial Spotlight
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Hero Card (8 cols) */}
        {mainStory && (
          <div className="lg:col-span-8">
            <Link
              to={`/news/${mainStory._id}`}
              className="group relative block rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 bg-slate-900 border border-slate-200/60 aspect-[16/10] sm:aspect-[16/9] lg:h-full min-h-[420px]"
            >
              <img
                src={mainStory.imageUrl}
                alt={mainStory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-600 text-white shadow-md">
                    {mainStory.category}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {mainStory.readTime || '4 min read'}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {mainStory.views || 0} reads
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white group-hover:text-rose-300 transition-colors line-clamp-2 leading-tight font-display">
                  {mainStory.title}
                </h1>

                <p className="mt-3 text-sm sm:text-base text-slate-300 line-clamp-2 max-w-2xl leading-relaxed">
                  {mainStory.summary}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={
                      mainStory.author?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                    }
                    alt={mainStory.author?.name || 'Author'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <span className="text-xs font-semibold text-white">
                    {mainStory.author?.name || mainStory.authorName}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">
                    {new Date(mainStory.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Side Trending Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">
                  Top Curated Reads
                </h3>
              </div>
              <Link to="/news" className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-0.5">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-around">
              {sideStories.map((story, i) => (
                <Link
                  key={story._id}
                  to={`/news/${story._id}`}
                  className="group flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <span className="text-2xl font-black text-slate-200 group-hover:text-rose-500 transition-colors font-display w-6">
                    0{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">
                      {story.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
                      {story.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {story.readTime || '3 min'} • {story.views || 0} views
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
