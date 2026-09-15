import React from 'react';
import { Clock, TrendingUp, Tag, ArrowRight, Sun, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsCard } from './NewsCard';

export const LatestNewsSection = ({ news = [] }) => {
  const latestArticles = news.slice(0, 4);

  const popularTags = [
    'AI',
    'Renewables',
    'Fintech',
    'GeneEditing',
    'SpaceX',
    'ChampionsLeague',
    'ClimateAccord',
    'Macroeconomics',
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
            Section 4 • Live Feed
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-8">
          The Latest Dispatches
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {latestArticles.map((article) => (
              <NewsCard key={article._id} news={article} variant="horizontal" />
            ))}

            <div className="pt-4 text-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-full border border-slate-300 shadow-sm transition"
              >
                <span>View Complete News Archive</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Markets Widget */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Global Market Pulse
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-700">S&P 500 Index</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">5,892.40</span>
                    <span className="text-emerald-600 ml-2 font-medium">+0.84%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-700">NASDAQ Composite</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">18,518.61</span>
                    <span className="text-emerald-600 ml-2 font-medium">+1.12%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-700">Brent Crude Oil</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">$74.15</span>
                    <span className="text-rose-600 ml-2 font-medium">-0.42%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-700">Clean Energy ETF</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">$89.30</span>
                    <span className="text-emerald-600 ml-2 font-medium">+2.35%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Topics & Tags */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                <Tag className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Trending Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/news?search=${tag}`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-medium rounded-lg border border-slate-200/70 transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Editorial Mission Callout */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block mb-2">
                Join the Bureau
              </span>
              <h4 className="text-base font-bold font-display mb-2">
                Become a Citizen Journalist
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Have a local news tip or groundbreaking investigative dispatch? Publish your reporting to Chronicle readers worldwide.
              </p>
              <Link
                to="/create-news"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                <span>Write Your Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
