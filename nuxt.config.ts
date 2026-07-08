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
          // MEMANGGIL KODE IKLAN ADSTERRA YANG BARU
          src: 'https://twigcrucialpal.com/d2/44/41/d24441981f5f5c0080b9c4b671cd48b7.js',
          async: true,
          tagPosition: 'bodyClose' // Diletakkan di bawah sebelum </body> agar tidak memperlambat loading film
        }
      ]
    }
  },

  // Konfigurasi Tailwind
  tailwindcss: {
    configPath: 'tailwind.config.ts' 
  },

  // Konfigurasi Runtime untuk API Key TMDB (Film)
  runtimeConfig: {
    public: {
      tmdbApiKey: ''
    }
  }
})
