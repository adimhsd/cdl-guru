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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
