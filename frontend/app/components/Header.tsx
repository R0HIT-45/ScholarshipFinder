'use client';
import React from 'react';
import { useAuth } from '@/app/context/auth';
import Link from 'next/link';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">
          EduEquity
        </Link>

        <nav className="hidden md:flex gap-1 lg:gap-2 items-center">
          <Link href="/" className="px-3 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all">
            Home
          </Link>
          <Link href="/saved" className="px-3 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all">
            Saved
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="px-3 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all"
              >
                Dashboard
              </Link>
              <Link href="/scholarships" className="px-3 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all">
                Scholarships
              </Link>
              <Link href="/recommendations" className="px-3 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all flex items-center gap-1">
                <span>🧠</span> AI Recommendations
              </Link>
              <div className="ml-2 flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">{user.name}</span>
                <button
                  onClick={logout}
                  className="btn-premium-outline px-4 py-2 text-sm"
                  type="button"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:text-blue-600 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-premium ml-2"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors active:scale-95"
            aria-label="Toggle menu"
            type="button"
          >
            <Menu size={24} className="text-slate-800 dark:text-slate-100" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/20 dark:border-slate-700/50 p-4 space-y-3">
          <Link href="/" className="block px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50 transition">
            Home
          </Link>
          <Link href="/saved" className="block px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50 transition">
            Saved
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="block px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50 transition"
              >
                Dashboard
              </Link>
              <Link href="/scholarships" className="block px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50 transition">
                Scholarships
              </Link>
              <Link href="/recommendations" className="block px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50 transition flex items-center gap-2">
                <span>🧠</span> AI Recommendations
              </Link>
              <div className="pt-2 border-t border-white/20 dark:border-slate-700/50 mt-2">
                <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 font-medium">Signed in as: <span className="font-bold">{user.name}</span></div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 btn-premium flex items-center justify-center gap-2"
                  type="button"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-4 py-2 rounded-lg text-slate-800 dark:text-slate-100 font-medium hover:bg-white/50 dark:hover:bg-slate-700/50 transition">
                Login
              </Link>
              <Link href="/register" className="block btn-premium text-center mt-2">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
