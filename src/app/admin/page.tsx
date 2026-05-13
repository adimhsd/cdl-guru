import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await auth()

  console.log('[ADMIN PAGE] session.user:', JSON.stringify(session?.user))
  console.log('[ADMIN PAGE] role:', (session?.user as any)?.role)

  if (!session?.user?.id) redirect('/login')

  const userRole = (session.user as any).role
  if (userRole !== 'ADMIN') {
    console.log('[ADMIN PAGE] Access denied, role is:', userRole)
    redirect('/dashboard')
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stats`, {
    cache: 'no-store',
    headers: {
      Cookie: `next-auth.session-token=${session}`,
    },
  })

  // Fetch data langsung dari Prisma agar lebih reliable
  const { prisma } = await import('@/lib/prisma')

  const rawUsers = await prisma.user.findMany({
    where: { role: 'GURU' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      createdAt: true,
      testResults: {
        select: {
          id: true, type: true, score: true, level: true, completedAt: true,
          answers: {
            select: { questionId: true, selectedAnswer: true, isCorrect: true, confidenceScore: true },
            orderBy: { questionId: 'asc' },
          },
        },
      },
      interactions: {
        select: { id: true, userInput: true, aiOutput: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  // Map testResults to preTest and postTest for the component
  const users = rawUsers.map(u => {
    const preTest = u.testResults.find(t => t.type === 'PRE_TEST')
    const postTest = u.testResults.find(t => t.type === 'POST_TEST')
    return {
      ...u,
      preTest,
      postTest,
    }
  })

  const totalUsers = users.length
  const usersWithPreTest = users.filter(u => u.preTest).length
  const usersWithPostTest = users.filter(u => u.postTest).length
  const usersCompleted = users.filter(u => u.preTest && u.postTest && u.interactions.length >= 5).length
  const improvements = users.filter(u => u.preTest && u.postTest).map(u => u.postTest!.score - u.preTest!.score)
  const avgImprovement = improvements.length > 0 ? improvements.reduce((a, b) => a + b, 0) / improvements.length : 0
  const avgPreScore = usersWithPreTest > 0 ? users.filter(u => u.preTest).reduce((s, u) => s + u.preTest!.score, 0) / usersWithPreTest : 0
  const avgPostScore = usersWithPostTest > 0 ? users.filter(u => u.postTest).reduce((s, u) => s + u.postTest!.score, 0) / usersWithPostTest : 0
  const levelDistribution = {
    BEGINNER: users.filter(u => u.level === 'BEGINNER').length,
    INTERMEDIATE: users.filter(u => u.level === 'INTERMEDIATE').length,
    ADVANCED: users.filter(u => u.level === 'ADVANCED').length,
    NONE: users.filter(u => !u.level).length,
  }
  const totalInteractions = users.reduce((sum, u) => sum + u.interactions.length, 0)
  const allAnswers = users.flatMap(u => [...(u.preTest?.answers ?? []), ...(u.postTest?.answers ?? [])])
  const avgConfidenceAll = allAnswers.length > 0 ? allAnswers.reduce((s, a) => s + a.confidenceScore, 0) / allAnswers.length : 0

  const stats = {
    totalUsers,
    usersWithPreTest,
    usersWithPostTest,
    usersCompleted,
    avgImprovement: Math.round(avgImprovement * 10) / 10,
    avgPreScore: Math.round(avgPreScore * 10) / 10,
    avgPostScore: Math.round(avgPostScore * 10) / 10,
    levelDistribution,
    totalInteractions,
    avgConfidenceAll: Math.round(avgConfidenceAll * 10) / 10,
  }

  return <AdminDashboardClient stats={stats} users={users as any} adminName={session.user.name ?? 'Admin'} />
}
