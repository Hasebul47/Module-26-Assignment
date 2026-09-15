import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, TrendingUp } from 'lucide-react';

export const BreakingTicker = ({ news = [] }) => {
  const tickerItems = news.slice(0, 5);

  if (!tickerItems.length) return null;

  return (
    <div className="bg-rose-50 border-y border-rose-200/80 py-2.5 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold tracking-wider uppercase text-[10px] flex-shrink-0 shadow-sm animate-pulse">
          <Flame className="w-3.5 h-3.5" />
          <span>Breaking Wire</span>
        </div>

        <div className="overflow-x-auto no-scrollbar flex items-center gap-6 whitespace-nowrap text-slate-700">
          {tickerItems.map((item, idx) => (
            <Link
              key={item._id}
              to={`/news/${item._id}`}
              className="hover:text-rose-600 transition flex items-center gap-2 group font-medium"
            >
              <span className="text-slate-400 font-bold">#{idx + 1}</span>
              <span className="group-hover:underline">{item.title}</span>
              {idx < tickerItems.length - 1 && (
                <span className="text-slate-300 ml-4">•</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
