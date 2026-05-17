"use client";

import { useEffect } from "react";

/**
 * Halaman Offline — ditampilkan oleh service worker saat pengguna
 * mengakses aplikasi tanpa koneksi internet.
 * 
 * Halaman ini TIDAK memerlukan autentikasi.
 */
export default function OfflinePage() {
  useEffect(() => {
    // Coba reload otomatis saat koneksi kembali
    const handleOnline = () => {
      window.location.reload();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-10">
          <div className="mx-auto w-32 md:w-48 h-auto mb-4 md:mb-6 transform hover:scale-105 transition-transform duration-300">
            <img
              src="/cdl-guru-logo.jpg"
              alt="CDL Guru Logo"
              className="w-full h-auto object-contain drop-shadow-xl rounded-xl"
            />
          </div>
        </div>

        {/* Card konten offline */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 md:p-10">
          {/* Ikon sinyal */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18.364 5.636a9 9 0 0 1 0 12.728M15.536 8.464a5 5 0 0 1 0 7.072M12 12h.01M8.464 8.464a5 5 0 0 0 0 7.072M5.636 5.636a9 9 0 0 0 0 12.728"
                />
                <line
                  x1="3"
                  y1="3"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-3">
            Anda Sedang Offline
          </h1>
          <p className="text-slate-500 text-sm text-center leading-relaxed mb-8">
            Anda sedang offline. Hubungkan perangkat ke internet dan masuk kembali
            untuk melanjutkan sesi pembelajaran.
          </p>

          {/* Tombol retry */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Coba Hubungkan Kembali
          </button>

          {/* Tips offline */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 text-center font-medium leading-relaxed">
              💡 Tip: Install CDL Guru sebagai aplikasi di perangkat Anda untuk
              pengalaman yang lebih baik, termasuk akses lebih cepat saat online.
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-10 font-medium uppercase tracking-widest">
          Research Initiative 2026
        </p>
      </div>
    </div>
  );
}
