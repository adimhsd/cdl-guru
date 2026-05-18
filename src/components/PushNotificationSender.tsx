"use client";

import { useState } from "react";

export default function PushNotificationSender() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          url,
          // userId bisa ditambahkan jika ingin kirim ke user spesifik. 
          // Tanpa userId, pesan dikirim ke semua user (broadcast).
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(`Berhasil! ${data.sent} notifikasi terkirim, ${data.failed} gagal.`);
        setTitle("");
        setBody("");
        setUrl("/");
      } else {
        setStatus("error");
        setMessage(data.error || "Gagal mengirim notifikasi.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Terjadi kesalahan sistem saat mengirim notifikasi.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest">Kirim Notifikasi Broadcast</h2>
          <p className="text-xs text-slate-500">Kirim pesan ke semua pengguna yang mengaktifkan notifikasi</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Pesan</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Pengingat Post-Test!"
            required
            className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Pesan</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Contoh: Jangan lupa selesaikan Post-Test Anda hari ini untuk mendapatkan sertifikat."
            required
            rows={3}
            className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">URL Tujuan (Opsional)</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/dashboard"
            className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[10px] text-slate-400 mt-1">Halaman yang terbuka ketika notifikasi diklik.</p>
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-bold ${
            status === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
            status === "error" ? "bg-red-50 text-red-700 border border-red-100" : ""
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !title || !body}
          className="w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {status === "loading" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Kirim Notifikasi Broadcast
            </>
          )}
        </button>
      </form>
    </div>
  );
}
