import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    clearError();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
              CHRONICLE<span className="text-rose-600">.</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Welcome Back, Journalist
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your author dashboard, draft dispatches, and reader community.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 bg-rose-50/80 border border-rose-200/80 rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-rose-800">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Evaluation Quick Fill:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('sarah.jenkins@chronicle.com', 'password123')}
              className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 font-medium rounded-lg border border-rose-200 shadow-2xs transition"
            >
              Sarah (Admin/Editor)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('alex.rivera@chronicle.com', 'password123')}
              className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 font-medium rounded-lg border border-rose-200 shadow-2xs transition"
            >
              Alex (Journalist)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@chronicle.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-rose-600 hover:underline">
              Create an author account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
