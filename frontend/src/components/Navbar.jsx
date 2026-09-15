import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Globe,
  PenSquare,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/news?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-rose-600 font-semibold'
        : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top micro bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              EDITION: GLOBAL
            </span>
            <span className="text-slate-500">|</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="hover:text-white transition">Editorial Inquiries</Link>
            <Link to="/news?category=Technology" className="hover:text-white transition">Tech Pulse</Link>
            <Link to="/news?category=Business" className="hover:text-white transition">Market Watch</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition duration-300">
                <Globe className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                  CHRONICLE<span className="text-rose-600">.</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold -mt-1">
                  Global Journalism
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 pl-4 border-l border-slate-200">
              <NavLink to="/" end className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/news" className={navLinkClasses}>
                All News
              </NavLink>
              <NavLink to="/news?category=Technology" className={navLinkClasses}>
                Technology
              </NavLink>
              <NavLink to="/news?category=Business" className={navLinkClasses}>
                Business
              </NavLink>
              <NavLink to="/news?category=Politics" className={navLinkClasses}>
                Politics
              </NavLink>
              <NavLink to="/news?category=Sports" className={navLinkClasses}>
                Sports
              </NavLink>
              <NavLink to="/contact" className={navLinkClasses}>
                Contact Us
              </NavLink>
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search articles, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 lg:w-64 pl-9 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Create News CTA (Always visible or visible to logged-in) */}
            {isAuthenticated ? (
              <Link
                to="/create-news"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-rose-600 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write News</span>
              </Link>
            ) : null}

            {/* Auth Dropdown or Buttons */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition focus:outline-none"
                  aria-label="User menu"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500/20"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>User Dashboard</span>
                      </Link>

                      <Link
                        to="/dashboard?tab=my-news"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>My Articles & Edit</span>
                      </Link>

                      <Link
                        to="/create-news"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition"
                      >
                        <PenSquare className="w-4 h-4 text-slate-400" />
                        <span>Publish New Article</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-sm hover:shadow-rose-500/25 transition duration-200"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              All News
            </Link>
            <Link
              to="/news?category=Technology"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Technology
            </Link>
            <Link
              to="/news?category=Business"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Business
            </Link>
            <Link
              to="/news?category=Politics"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Politics
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Contact Us
            </Link>

            {isAuthenticated ? (
              <>
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to="/create-news"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-base font-semibold text-rose-600 bg-rose-50 rounded-xl"
                  >
                    <PenSquare className="w-5 h-5" />
                    Publish Article
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
                  >
                    <LayoutDashboard className="w-5 h-5 text-slate-400" />
                    Dashboard & Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-semibold border border-slate-300 rounded-xl text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-semibold bg-rose-600 text-white rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
