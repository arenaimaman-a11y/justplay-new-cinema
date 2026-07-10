// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Modul yang digunakan
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase'
  ],

  // Masukkan URL dan Key Supabase Anda langsung di sini
  supabase: {
    url: 'https://fezcmyvrsrsjgjmikxwd.supabase.co', // Ganti dengan URL Project Supabase Anda
    key: 'sb_publishable_svLOIXd55_g1asTm0kvmKA_K6XqvDdY', // Publishable Key Anda
    redirect: false 
  },

  // Konfigurasi Head untuk skrip iklan global
  app: {
    head: {
      script: [
        {
          src: 'https://twigcrucialpal.com/d2/44/41/d24441981f5f5c0080b9c4b671cd48b7.js',
          async: true,
          tagPosition: 'bodyClose'
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