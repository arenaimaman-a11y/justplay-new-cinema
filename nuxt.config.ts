// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://cdn.fluidplayer.com/v3/current/fluidplayer.min.css' 
        }
      ],
      script: [
        { 
          src: 'https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js',
          async: true
        }
      ]
    }
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts' 
  },

  runtimeConfig: {
    public: {
      tmdbApiKey: ''
    }
  }
})