import { Redis } from '@upstash/redis'

// Inisialisasi Upstash Redis REST Client
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  // 1. TERIMA POSTBACK DARI ADBLUEMEDIA (Saat User Selesai Survei)
  if (query.sub5) {
    const userId = String(query.sub5)

    // Simpan status ke Upstash Redis (RAM)
    // EX: 86400 artinya data akan otomatis terhapus dalam 24 jam agar memori tidak penuh
    await redis.set(`user_completed:${userId}`, 'true', { ex: 86400 })

    const offerId = String(query.offer_id || '-')
    const payout = String(query.payout || '0')
    const ip = String(query.ip || '-')

    // Kirim Notifikasi Lead ke Telegram Bot
    const textMessage = 
      `🚀 Lead Notification\n\n` +
      `• Offer ID : ${offerId}\n` +
      `• Payout : $${payout}\n` +
      `• IP : ${ip}\n` +
      `• User ID (Sub5) : ${userId}`

    try {
      await $fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN || config.telegramBotToken}/sendMessage`, {
        method: 'GET',
        query: {
          chat_id: process.env.TELEGRAM_CHAT_ID || config.telegramChatId,
          text: textMessage
        }
      })
    } catch (err) {
      console.error('Gagal mengirim notifikasi Telegram:', err)
    }

    return { status: 'success', message: 'Saved to Upstash Redis & Telegram notified' }
  }

  // 2. PENGECEKAN (POLLING) DARI VUE FRONTEND WEBSITE
  if (query.check_subid) {
    const checkId = String(query.check_subid)
    
    // Minta data status dari Upstash Redis
    const isCompleted = await redis.get(`user_completed:${checkId}`)
    
    return { completed: isCompleted === 'true' }
  }

  return { error: 'Invalid request' }
})