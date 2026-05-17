import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { pool } from '@/lib/prisma'

/**
 * POST /api/push/subscribe
 * Menyimpan subscription push notification untuk user yang sedang login.
 * Jika endpoint sudah ada untuk user ini, lakukan update (upsert).
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subscription } = body as {
      subscription: {
        endpoint: string
        keys: { p256dh: string; auth: string }
      }
    }

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Data subscription tidak valid' }, { status: 400 })
    }

    const userId = session.user.id

    // Upsert: jika endpoint sudah ada untuk user ini, update; jika tidak, insert baru
    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint)
       DO UPDATE SET
         user_id   = EXCLUDED.user_id,
         p256dh    = EXCLUDED.p256dh,
         auth      = EXCLUDED.auth,
         updated_at = NOW()`,
      [userId, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth]
    )

    return NextResponse.json({ message: 'Subscription berhasil disimpan' }, { status: 201 })
  } catch (error) {
    console.error('[Push Subscribe Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
