import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { pool } from '@/lib/prisma'
import webpush from 'web-push'

/**
 * POST /api/push/send
 * Mengirim push notification ke user tertentu atau broadcast ke semua user.
 * Hanya ADMIN yang boleh mengakses endpoint ini.
 */

// Konfigurasi web-push dengan VAPID keys
// Hanya diinisialisasi saat runtime (bukan build-time) agar tidak crash saat docker build
if (process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_MAILTO || 'mailto:admin@cdl-guru.id',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function POST(request: Request) {
  try {
    // Verifikasi sesi dan role ADMIN
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: hanya ADMIN yang dapat mengirim notifikasi' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, title, body: notifBody, url } = body as {
      userId?: string
      title: string
      body: string
      url?: string
    }

    if (!title || !notifBody) {
      return NextResponse.json({ error: 'Field title dan body wajib diisi' }, { status: 400 })
    }

    // Ambil subscriptions berdasarkan userId atau semua
    let queryResult
    if (userId) {
      queryResult = await pool.query(
        'SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = $1',
        [userId]
      )
    } else {
      queryResult = await pool.query(
        'SELECT id, endpoint, p256dh, auth FROM push_subscriptions'
      )
    }

    const subscriptions = queryResult.rows

    if (subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, message: 'Tidak ada subscription yang ditemukan' })
    }

    // Payload notifikasi
    const payload = JSON.stringify({
      title,
      body: notifBody,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      url: url || '/',
    })

    let sent = 0
    let failed = 0
    const invalidEndpoints: string[] = []

    // Kirim notifikasi ke setiap subscription
    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          )
          sent++
        } catch (error: unknown) {
          failed++
          console.error(`[Push Send] Gagal kirim ke ${sub.endpoint}:`, error)

          // Hapus subscription yang sudah tidak valid (status 404 atau 410)
          const webPushError = error as { statusCode?: number }
          if (webPushError?.statusCode === 404 || webPushError?.statusCode === 410) {
            invalidEndpoints.push(sub.endpoint)
          }
        }
      })
    )

    // Hapus subscriptions yang tidak valid dari database
    if (invalidEndpoints.length > 0) {
      await pool.query(
        `DELETE FROM push_subscriptions WHERE endpoint = ANY($1::text[])`,
        [invalidEndpoints]
      )
      console.log(`[Push Send] Dihapus ${invalidEndpoints.length} subscription tidak valid`)
    }

    return NextResponse.json({
      sent,
      failed,
      message: `Berhasil mengirim ${sent} notifikasi, gagal ${failed}`,
    })
  } catch (error) {
    console.error('[Push Send Error]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
