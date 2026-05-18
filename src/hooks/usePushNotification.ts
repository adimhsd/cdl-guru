'use client'

import { useState, useEffect, useCallback } from 'react'

// ==========================================
// Utility: konversi VAPID public key dari base64 ke Uint8Array
// ==========================================
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// ==========================================
// Types
// ==========================================
interface UsePushNotificationReturn {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  permissionState: NotificationPermission | 'unknown'
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
}

// ==========================================
// Hook: usePushNotification
// ==========================================
export function usePushNotification(): UsePushNotificationReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unknown'>('unknown')

  // Cek dukungan browser dan status subscription saat mount
  useEffect(() => {
    const checkSupport = async () => {
      if (
        typeof window === 'undefined' ||
        !('serviceWorker' in navigator) ||
        !('PushManager' in window) ||
        !('Notification' in window)
      ) {
        setIsSupported(false)
        setIsLoading(false)
        return
      }

      setIsSupported(true)
      setPermissionState(Notification.permission)

      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          const existingSubscription = await registration.pushManager.getSubscription()
          setIsSubscribed(!!existingSubscription)
        } else {
          setIsSubscribed(false)
        }
      } catch (error) {
        console.error('[usePushNotification] Gagal cek subscription:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSupport()
  }, [])

  // Fungsi subscribe
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      alert('Browser Anda tidak mendukung push notification.')
      return
    }

    setIsLoading(true)
    try {
      // Minta izin notifikasi
      const permission = await Notification.requestPermission()
      setPermissionState(permission)

      if (permission !== 'granted') {
        console.warn('[usePushNotification] Izin notifikasi ditolak')
        return
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.error('[usePushNotification] NEXT_PUBLIC_VAPID_PUBLIC_KEY tidak ditemukan')
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as BufferSource,
      })

      // Kirim subscription ke server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan subscription ke server')
      }

      setIsSubscribed(true)
    } catch (error) {
      console.error('[usePushNotification] Gagal subscribe:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isSupported])

  // Fungsi unsubscribe
  const unsubscribe = useCallback(async () => {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        setIsSubscribed(false)
        return
      }

      // Hapus dari server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      })

      // Unsubscribe dari browser
      await subscription.unsubscribe()
      setIsSubscribed(false)
    } catch (error) {
      console.error('[usePushNotification] Gagal unsubscribe:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permissionState,
    subscribe,
    unsubscribe,
  }
}
