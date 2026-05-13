"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import LevelBadge from './LevelBadge';
import { handleSignOut } from '@/lib/actions';

type NavbarProps = {
  userName?: string | null;
  userEmail?: string | null;
  level?: string;
  showNav?: boolean;
};

export default function Navbar({ userName, userEmail, level, showNav = true }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm relative">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <img 
            src="/cdl-guru-logo.jpg" 
            alt="CDL Guru Logo" 
            className="w-10 h-10 object-contain rounded-lg shadow-sm transform group-hover:scale-105 transition-transform shrink-0 bg-white" 
          />
          <span className="font-bold text-slate-800 tracking-tight">CDL Guru</span>
        </Link>

        {userName && (
          <div className="flex items-center gap-4">
            {showNav && (
              <div className="hidden md:flex items-center gap-6 mr-6 border-r border-slate-100 pr-6">
                <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Dashboard</Link>
                <Link href="/ai" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">AI Tutor</Link>
              </div>
            )}

            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-800 leading-none">{userName}</p>
              {level && <div className="mt-1 flex justify-end"><LevelBadge level={level} /></div>}
            </div>
            
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner shrink-0 hidden sm:flex">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Keluar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </form>
            </div>

            <button 
              className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>

      {userName && isMobileOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4 shadow-lg absolute w-full left-0 top-16">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{userName}</p>
                {level && <div className="mt-1"><LevelBadge level={level} /></div>}
              </div>
            </div>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-xs text-red-600 font-bold px-3 py-2 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar
              </button>
            </form>
          </div>

          {showNav && (
            <div className="flex flex-col space-y-2">
              <Link 
                href="/dashboard" 
                className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 active:bg-slate-100 flex items-center gap-3"
                onClick={() => setIsMobileOpen(false)}
              >
                📊 Dashboard
              </Link>
              <Link 
                href="/ai" 
                className="px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 active:bg-slate-100 flex items-center gap-3"
                onClick={() => setIsMobileOpen(false)}
              >
                🤖 AI Tutor
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
