import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig
