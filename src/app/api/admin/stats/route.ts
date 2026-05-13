import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Ambil semua user GURU beserta seluruh data terkait
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
            id: true,
            type: true,
            score: true,
            level: true,
            completedAt: true,
            answers: {
              select: {
                questionId: true,
                selectedAnswer: true,
                isCorrect: true,
                confidenceScore: true,
              },
              orderBy: { questionId: 'asc' },
            },
          },
        },
        interactions: {
          select: {
            id: true,
            userInput: true,
            aiOutput: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    const mappedUsers = rawUsers.map(u => {
      const preTest = u.testResults.find(t => t.type === 'PRE_TEST')
      const postTest = u.testResults.find(t => t.type === 'POST_TEST')
      return {
        ...u,
        preTest,
        postTest,
      }
    })

    const users = mappedUsers

    // Hitung statistik agregat
    const totalUsers = users.length
    const usersWithPreTest = users.filter(u => u.preTest).length
    const usersWithPostTest = users.filter(u => u.postTest).length
    const usersCompleted = users.filter(u => u.preTest && u.postTest && u.interactions.length >= 5).length

    const improvements = users
      .filter(u => u.preTest && u.postTest)
      .map(u => u.postTest!.score - u.preTest!.score)
    const avgImprovement = improvements.length > 0
      ? improvements.reduce((a, b) => a + b, 0) / improvements.length
      : 0

    const avgPreScore = users.filter(u => u.preTest).length > 0
      ? users.filter(u => u.preTest).reduce((sum, u) => sum + u.preTest!.score, 0) / usersWithPreTest
      : 0
    const avgPostScore = users.filter(u => u.postTest).length > 0
      ? users.filter(u => u.postTest).reduce((sum, u) => sum + u.postTest!.score, 0) / usersWithPostTest
      : 0

    const levelDistribution = {
      BEGINNER: users.filter(u => u.level === 'BEGINNER').length,
      INTERMEDIATE: users.filter(u => u.level === 'INTERMEDIATE').length,
      ADVANCED: users.filter(u => u.level === 'ADVANCED').length,
      NONE: users.filter(u => !u.level).length,
    }

    const totalInteractions = users.reduce((sum, u) => sum + u.interactions.length, 0)
    const avgConfidenceAll = (() => {
      const allAnswers = users.flatMap(u => [
        ...(u.preTest?.answers ?? []),
        ...(u.postTest?.answers ?? []),
      ])
      if (!allAnswers.length) return 0
      return allAnswers.reduce((sum, a) => sum + a.confidenceScore, 0) / allAnswers.length
    })()

    return NextResponse.json({
      stats: {
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
      },
      users,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
