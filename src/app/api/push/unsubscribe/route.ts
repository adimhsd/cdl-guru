import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { pool } from '@/lib/prisma'

/**
 * POST /api/push/unsubscribe
 * Menghapus subscription push notification berdasarkan endpoint.
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { endpoint } = body as { endpoint: string }

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint tidak ditemukan di request body' }, { status: 400 })
    }

    const userId = session.user.id

    // Hapus subscription — pastikan hanya milik user yang sedang login
    const result = await pool.query(
      `DELETE FROM push_subscriptions
       WHERE endpoint = $1 AND user_id = $2`,
      [endpoint, userId]
    )

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json({ message: 'Subscription tidak ditemukan atau sudah dihapus' }, { status: 200 })
    }

    return NextResponse.json({ message: 'Subscription berhasil dihapus' }, { status: 200 })
  } catch (error) {
    console.error('[Push Unsubscribe Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
