import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [user, preTest, postTest, interactionCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, level: true, createdAt: true },
      }),
      prisma.testResult.findFirst({
        where: { userId, type: 'PRE_TEST' },
        select: { score: true, level: true, completedAt: true },
      }),
      prisma.testResult.findFirst({
        where: { userId, type: 'POST_TEST' },
        select: { score: true, level: true, completedAt: true },
      }),
      prisma.interaction.count({ where: { userId } }),
    ])

    return NextResponse.json({
      user,
      preTest,
      postTest,
      interactionCount,
      improvement: preTest && postTest ? postTest.score - preTest.score : null,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
