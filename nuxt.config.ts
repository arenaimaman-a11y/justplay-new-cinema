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

  // Konfigurasi Tailwind (default Nuxt Tailwind sudah menangani path secara otomatis)
  tailwindcss: {
    configPath: 'tailwind.config.ts' // Pastikan file ini ada atau hapus blok ini jika menggunakan default
  },

  // Konfigurasi Runtime yang lebih stabil
  runtimeConfig: {
    public: {
      // Nuxt secara otomatis memetakan NUXT_PUBLIC_TMDB_API_KEY dari Vercel
      // ke sini tanpa perlu memanggil process.env secara manual
      tmdbApiKey: ''
    }
  }
})