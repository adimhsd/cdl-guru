import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === '/login'
  const isPanduanPage = req.nextUrl.pathname === '/panduan'

  if (!isLoggedIn && !isLoginPage && !isPanduanPage) {
    return Response.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: [
    /*
     * Jalankan middleware di semua rute KECUALI:
     * - api             : API routes
     * - _next/static    : File statis Next.js
     * - _next/image     : Optimasi gambar Next.js
     * - favicon.ico     : Favicon
     * - manifest.json   : PWA manifest (HARUS bisa diakses tanpa login)
     * - sw.js           : PWA Service Worker (HARUS bisa diakses tanpa login)
     * - workbox-*.js    : File Workbox untuk service worker
     * - offline         : Halaman offline fallback
     * - icons/          : Ikon PWA
     * - File gambar     : .svg, .png, .jpg, .jpeg, .gif, .webp, .ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest\\.json|sw\\.js|workbox-.*\\.js|offline|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
