import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { POST_TEST_QUESTIONS, calculateScore, getLevel } from '@/lib/questions'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Cek pre-test sudah selesai
    const preTest = await prisma.testResult.findFirst({
      where: { userId, type: 'PRE_TEST' },
    })
    if (!preTest) {
      return NextResponse.json({ error: 'Pre-test belum diselesaikan' }, { status: 403 })
    }

    // Cek jumlah interaksi >= 10
    const interactionCount = await prisma.interaction.count({ where: { userId } })
    if (interactionCount < 10) {
      return NextResponse.json(
        { error: `Interaksi belum cukup. Saat ini: ${interactionCount}/10` },
        { status: 403 }
      )
    }

    // Cek belum pernah post-test
    const existingPostTest = await prisma.testResult.findFirst({
      where: { userId, type: 'POST_TEST' },
    })
    if (existingPostTest) {
      return NextResponse.json({ error: 'Post-test sudah pernah dikerjakan' }, { status: 400 })
    }

    const { answers } = await req.json() as {
      answers: { questionId: number; selectedAnswer: string; confidenceScore: number }[]
    }

    if (!answers || answers.length !== 15) {
      return NextResponse.json({ error: 'Jawaban tidak valid' }, { status: 400 })
    }

    const score = calculateScore(
      answers.map((a) => ({ questionId: a.questionId, selectedAnswer: a.selectedAnswer })),
      POST_TEST_QUESTIONS
    )
    const level = getLevel(score)

    await prisma.testResult.create({
      data: {
        userId,
        type: 'POST_TEST',
        score,
        level,
        answers: {
          create: answers.map((a) => {
            const question = POST_TEST_QUESTIONS.find((q) => q.id === a.questionId)
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

    // Update level user jika meningkat
    await prisma.user.update({
      where: { id: userId },
      data: { level },
    })

    const improvement = score - preTest.score

    return NextResponse.json({
      score,
      level,
      total: 15,
      preTestScore: preTest.score,
      preTestLevel: preTest.level,
      improvement,
    })
  } catch (error) {
    console.error('Post-test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
