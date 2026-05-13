import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
        {/* Baris 1: Menonjol dan lebih besar */}
        <div className="mb-3">
          <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
            CDL Guru AI-Based Adaptive Learning
          </h2>
        </div>

        {/* Baris 2: Info Hibah */}
        <div className="text-sm font-medium text-slate-500 mb-2">
          Hibah DPPM 2026 &middot; Kemendiktisaintek RI
        </div>

        {/* Baris 3: Copyright & Developer */}
        <div className="text-xs text-slate-400">
          &copy; 2026 Hak Cipta Dilindungi. Developed by{' '}
          <a
            href="https://adi-muhamad.my.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 font-semibold transition-colors"
          >
            adi-muhamad.my.id
          </a>
        </div>
      </div>
    </footer>
  );
}
