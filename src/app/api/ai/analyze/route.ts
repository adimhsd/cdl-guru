import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SYSTEM_PROMPT, LEVEL_PROMPTS } from '@/lib/ai-prompts'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const preTest = await prisma.testResult.findFirst({
      where: { userId, type: 'PRE_TEST' },
    })
    if (!preTest) {
      return NextResponse.json({ error: 'Pre-test belum diselesaikan' }, { status: 403 })
    }

    const { message, history } = await req.json() as {
      message: string
      history: ChatMessage[]
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Pesan tidak valid' }, { status: 400 })
    }

    const wordCount = countWords(message)
    if (wordCount > 500) {
      return NextResponse.json(
        { error: `Teks terlalu panjang (${wordCount} kata). Maksimal 500 kata.` },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true },
    })

    const level = user?.level ?? 'BEGINNER'
    const levelPrompt = LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS] ?? LEVEL_PROMPTS.BEGINNER
    const combinedSystemPrompt = `${SYSTEM_PROMPT}\n\n${levelPrompt}`

    const recentHistory = (history ?? []).slice(-10)
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: combinedSystemPrompt },
      ...recentHistory.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    // ── Streaming ──────────────────────────────────────────────────────
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      stream: true,
    })

    let fullResponse = ''

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? ''
            if (text) {
              fullResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }
        } finally {
          // Simpan ke DB setelah stream selesai
          try {
            await prisma.interaction.create({
              data: { userId, userInput: message, aiOutput: fullResponse },
            })
            const interactionCount = await prisma.interaction.count({ where: { userId } })
            // Kirim metadata interaksi sebagai chunk terakhir dengan format khusus
            controller.enqueue(
              encoder.encode(`\x00META${JSON.stringify({ interactionCount })}`)
            )
          } catch (dbErr) {
            console.error('DB save error:', dbErr)
          }
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('AI analyze error:', error)
    return NextResponse.json({ error: 'AI sedang tidak tersedia, coba beberapa saat lagi.' }, { status: 500 })
  }
}
