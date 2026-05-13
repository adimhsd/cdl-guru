import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PRE_TEST_QUESTIONS, calculateScore, getLevel } from '@/lib/questions'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { answers } = await req.json() as {
      answers: { questionId: number; selectedAnswer: string; confidenceScore: number }[]
    }

    if (!answers || answers.length !== 15) {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 })
    }

    // Check if already completed
    const existing = await prisma.testResult.findFirst({
      where: { userId, type: 'PRE_TEST' },
    })
    if (existing) {
      return NextResponse.json({ error: 'Pre-test already completed' }, { status: 409 })
    }

    const score = calculateScore(answers.map(a => ({ questionId: a.questionId, selectedAnswer: a.selectedAnswer })), PRE_TEST_QUESTIONS)
    const level = getLevel(score)

    const result = await prisma.testResult.create({
      data: {
        userId,
        type: 'PRE_TEST',
        score,
        level,
        answers: {
          create: answers.map((a) => {
            const question = PRE_TEST_QUESTIONS.find(q => q.id === a.questionId)
            return {
              questionId: a.questionId,
              selectedAnswer: a.selectedAnswer,
              isCorrect: question?.answer === a.selectedAnswer,
              confidenceScore: a.confidenceScore,
            }
          }),
        },
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: { level },
    })

    return NextResponse.json({ score, level, total: 15, resultId: result.id })
  } catch (error) {
    console.error('Pre-test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
