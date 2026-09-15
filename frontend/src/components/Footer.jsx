import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, ArrowRight, ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const categories = [
    'Technology',
    'Business',
    'Politics',
    'Sports',
    'Entertainment',
    'Health',
    'World',
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                CHRONICLE<span className="text-rose-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Chronicle is an independent digital news platform committed to uncompromising investigative journalism, insightful geopolitical analysis, and cutting-edge technology breakthroughs.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Fact-Checking Standards & Ethics Code</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition">
                  Home Frontpage
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-slate-400 hover:text-white transition">
                  All News Feed
                </Link>
              </li>
              <li>
                <Link to="/create-news" className="text-slate-400 hover:text-white transition">
                  Submit an Article
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition">
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/news?category=${cat}`}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Daily Intelligence
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Receive the top morning briefing curated by our editorial bureau directly to your inbox.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Thank you! You are subscribed to our daily briefing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900 border border-slate-750 focus:border-rose-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition duration-200"
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Chronicle Media Group. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for journalistic integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
