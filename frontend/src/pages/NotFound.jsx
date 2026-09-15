import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
        Page Not Located
      </h1>
      <p className="mt-2 text-sm text-slate-600 max-w-sm">
        The article, category archive, or destination you requested does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-rose-600 text-white rounded-full text-xs font-bold transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Frontpage
      </Link>
    </div>
  );
};
