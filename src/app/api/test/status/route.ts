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

    const [preTest, postTest, interactionCount] = await Promise.all([
      prisma.testResult.findFirst({ where: { userId, type: 'PRE_TEST' } }),
      prisma.testResult.findFirst({ where: { userId, type: 'POST_TEST' } }),
      prisma.interaction.count({ where: { userId } }),
    ])

    return NextResponse.json({
      hasPreTest: !!preTest,
      hasPostTest: !!postTest,
      interactionCount,
      preTestScore: preTest?.score ?? null,
      preTestLevel: preTest?.level ?? null,
    })
  } catch (error) {
    console.error('Status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
