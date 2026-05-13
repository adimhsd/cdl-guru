import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      console.log("[JWT Callback] INITIAL user:", user, "token:", token);
      // Saat login baru: simpan id dan role dari user object
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? 'GURU'
      }
      // Jika token sudah ada tapi belum punya role (sesi lama),
      // ambil role langsung dari database
      if (token.id && !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          })
          token.role = dbUser?.role ?? 'GURU'
        } catch {
          token.role = 'GURU'
        }
      }
      console.log("[JWT Callback] FINAL token.role:", token.role);
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = (token.role as 'GURU' | 'ADMIN') ?? 'GURU'
      }
      console.log("[SESSION Callback] FINAL session.user.role:", (session.user as any).role);
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log("Attempting login for:", credentials?.email)
          if (!credentials?.email || !credentials?.password) return null

          // Hardcoded test for debugging
          if (credentials.email === "test@mail.com" && credentials.password === "test123") {
            console.log("Hardcoded test login success")
            return { id: "test-id", email: "test@mail.com", name: "Test User", role: "GURU" } as any
          }
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })
          
          console.log("Database user found:", user ? "YES" : "NO")
          
          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }
          
          const valid = await bcrypt.compare(credentials.password as string, user.password)
          console.log("Password valid:", valid)
          
          if (!valid) return null
          
          console.log("[Authorize] user object before return:", { id: user.id, email: user.email, name: user.name, role: user.role })
          return { id: user.id, email: user.email, name: user.name, role: user.role } as any
        } catch (error) {
          console.error("Login Error Details:", error)
          return null
        }
      },
    }),
  ],
})
