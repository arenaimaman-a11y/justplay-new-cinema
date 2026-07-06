// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Modul yang digunakan
  modules: ['@nuxtjs/tailwindcss'],
  
  // Konfigurasi Head untuk skrip iklan global
  app: {
    head: {
      script: [
        {
          src: 'https://twigcrucialpal.com/be/f2/69/bef26991ea47e4726d32d129819ac790.js',
          async: true,
          tagPosition: 'bodyClose'
        }
      ]
    }
  },
  
  // Konfigurasi Tailwind
  tailwindcss: {
    config: {
      content: [
        './app.vue',
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}'
      ]
    }
  },

  // Konfigurasi Runtime untuk API Key
  runtimeConfig: {
    public: {
      // process.env akan mengambil nilai dari Vercel Environment Variables
      // Pastikan Key di Vercel adalah NUXT_PUBLIC_TMDB_API_KEY
      tmdbApiKey: process.env.NUXT_PUBLIC_TMDB_API_KEY || ''
    }
  }
})