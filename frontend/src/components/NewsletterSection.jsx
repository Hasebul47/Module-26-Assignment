import React, { useState } from 'react';
import { Mail, CheckCircle2, Shield, Users, Award, Sparkles } from 'lucide-react';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-rose-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 5 • Community & Daily Briefing</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
              Essential Journalism for Informed Minds
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              Join over 150,000 discerning readers. Get our morning intelligence memo analyzing key geopolitical shifts, market forces, and tech breakthroughs.
            </p>

            {/* Form */}
            <div className="mt-8 max-w-md mx-auto">
              {status === 'success' ? (
                <div className="p-4 bg-emerald-900/60 border border-emerald-500 rounded-2xl flex items-center justify-center gap-3 text-emerald-300 text-sm font-medium animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Welcome aboard! You have been subscribed to Chronicle Briefing.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 text-sm bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 backdrop-blur-md"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition duration-200 whitespace-nowrap"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}
              <p className="text-[11px] text-slate-400 mt-2.5">
                Zero spam. One-click unsubscribe at any time. Read our privacy charter.
              </p>
            </div>

            {/* Trust Metrics */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-3xl font-black font-display text-white">150K+</p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Active Readers</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black font-display text-white">40+</p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Global Journalists</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black font-display text-white">100%</p>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Independent Media</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
