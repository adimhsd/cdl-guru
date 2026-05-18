'use client'

import { usePushNotification } from '@/hooks/usePushNotification'

/**
 * Komponen toggle untuk mengaktifkan/menonaktifkan push notification.
 * Gunakan di halaman settings/profil user.
 */
export default function PushNotificationToggle() {
  const { isSupported, isSubscribed, isLoading, permissionState, subscribe, unsubscribe } =
    usePushNotification()

  // Browser tidak mendukung push notification
  if (!isSupported) {
    return (
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M18.364 5.636a9 9 0 0 1 0 12.728M15.536 8.464a5 5 0 0 1 0 7.072M12 12h.01" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">
          Browser Anda tidak mendukung push notification.
        </p>
      </div>
    )
  }

  // Izin ditolak oleh pengguna
  if (permissionState === 'denied') {
    return (
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">Notifikasi diblokir</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Notifikasi diblokir oleh browser. Untuk mengaktifkan, buka Pengaturan Browser →
            Privasi → Notifikasi, lalu izinkan situs ini.
          </p>
        </div>
      </div>
    )
  }

  const handleToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe()
      } else {
        await subscribe()
      }
    } catch {
      // Error sudah di-log di dalam hook
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Label & deskripsi */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            isSubscribed ? 'bg-blue-50' : 'bg-slate-100'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-colors ${isSubscribed ? 'text-blue-600' : 'text-slate-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {isSubscribed ? 'Notifikasi Aktif' : 'Aktifkan Notifikasi'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSubscribed
              ? 'Anda akan menerima notifikasi dari platform ini'
              : 'Dapatkan info terbaru dan pengingat dari CDL Guru'}
          </p>
        </div>
      </div>

      {/* Toggle switch */}
      <button
        id="push-notification-toggle"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isSubscribed ? 'Nonaktifkan notifikasi' : 'Aktifkan notifikasi'}
        aria-pressed={isSubscribed}
        className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isSubscribed ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
            isSubscribed ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
