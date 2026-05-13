"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostTestButton() {
  const [showWarning, setShowWarning] = useState(false);
  const router = useRouter();

  return (
    <>
      <button 
        onClick={() => setShowWarning(true)}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
      >
        Ambil Post-Test Final
      </button>

      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 shadow-inner">
              ⚠️
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-3 tracking-tight">Konfirmasi Post-Test</h2>
            <p className="text-slate-600 text-center leading-relaxed mb-8 font-medium">
              Setelah Post-Test dilakukan, Anda akan mengakhiri seluruh proses pembelajaran CDL di platform ini. 
              <br /><br />
              Pastikan Anda merasa sudah cukup berlatih. Jika belum yakin, silakan kembali berinteraksi dengan AI Asisten sampai Anda merasa memiliki kemampuan yang cukup baik.
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                href="/ai" 
                className="w-full py-4 px-4 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100 transition-colors text-center"
              >
                Kembali berinteraksi dengan AI Asisten
              </Link>
              <button 
                onClick={() => router.push('/posttest')} 
                className="w-full py-4 px-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors text-center shadow-lg shadow-emerald-200"
              >
                Lanjut Post-Test →
              </button>
              <button 
                onClick={() => setShowWarning(false)} 
                className="mt-2 text-sm text-slate-400 font-medium hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
