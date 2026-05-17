/**
 * Script untuk generate VAPID keys untuk push notifications.
 * 
 * CARA PENGGUNAAN:
 * 1. Jalankan: npm run generate-vapid
 * 2. Salin output ke .env.local dan environment variables VPS Anda
 * 
 * ⚠️ PENTING: Jalankan script ini SEKALI SAJA.
 * Jika di-generate ulang, semua subscription push yang ada
 * akan menjadi tidak valid dan perlu di-subscribe ulang.
 */

const webpush = require('web-push');

const keys = webpush.generateVAPIDKeys();

console.log('\n✅ VAPID Keys berhasil digenerate!\n');
console.log('Tambahkan baris berikut ke file .env.local dan .env VPS Anda:\n');
console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
console.log('\n⚠️  SIMPAN KEYS INI DI TEMPAT AMAN. JANGAN DI-GENERATE ULANG!');
