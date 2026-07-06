// server/api/locale.ts
export default defineEventHandler(async (event) => {
  try {
    // 1. Ambil IP asli user (terutama jika dideploy di Vercel, Netlify, atau Cloudflare)
    const headers = getHeaders(event)
    const ip = headers['x-forwarded-for'] || event.node.req.socket.remoteAddress || ''

    // 2. Tembak API Geolocation gratis untuk cek negara
    const geoData: any = await $fetch(`https://ipapi.co/${ip}/json/`).catch(() => null)
    
    const countryCode = geoData?.country_code || 'ID' // Default ke Indonesia jika gagal mendeteksi
    
    // 3. Mapping kode negara ke bahasa yang didukung oleh TMDB API
    const languageMapping: Record<string, string> = {
      ID: 'id-ID', // Indonesia
      MY: 'ms-MY', // Malaysia
      TH: 'th-TH', // Thailand
      JP: 'ja-JP', // Jepang
      KR: 'ko-KR', // Korea
    }

    // Jika negaranya tidak ada di daftar atas, otomatis beri bahasa Inggris ('en-US')
    const userLanguage = languageMapping[countryCode] || 'en-US'

    return {
      lang: userLanguage
    }
  } catch (error) {
    // Jalur aman jika API Geolocation down
    return { lang: 'id-ID' }
  }
})