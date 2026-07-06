// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
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

  // Perubahan di sini: Nuxt akan otomatis mencocokkan NUXT_PUBLIC_TMDB_API_KEY dari .env
  runtimeConfig: {
    public: {
      tmdbApiKey: '' 
    }
  }
})