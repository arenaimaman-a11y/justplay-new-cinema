<template>
  <div class="bg-gray-950 min-h-screen text-gray-200 antialiased selection:bg-red-600 selection:text-white relative overflow-hidden">
    
    <!-- HERO SECTIONS WITH BACKDROP BANNER -->
    <section v-if="heroMovie" class="relative w-full min-h-[65vh] sm:min-h-[75vh] md:h-[85vh] flex items-end md:items-center overflow-hidden bg-gray-950 pb-10 md:pb-0">
      <div class="absolute inset-0">
        <img 
          :src="`${backdropUrl}${heroMovie.backdrop_path}`" 
          class="w-full h-full object-cover object-center md:object-top animate-fade-in"
          :alt="heroMovie.title"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 md:via-gray-950/40 to-transparent"></div>
        <div class="hidden md:block absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent"></div>
      </div>

      <div class="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl mt-28 md:mt-16">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-600/20 border border-red-500/30 text-red-500 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-2 md:mb-4 animate-pulse">
          🔥 Trending Now
        </span>
        
        <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl drop-shadow-md line-clamp-2 md:line-clamp-none">
          {{ heroMovie.title }}
        </h1>
        
        <div class="flex items-center gap-3 mt-3 text-[11px] md:text-sm font-medium text-gray-300">
          <span class="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
            ⭐ {{ heroMovie.vote_average?.toFixed(1) }}
          </span>
          <span>{{ heroMovie.release_date?.split('-')[0] }}</span>
          <span class="px-1 py-0.5 uppercase border border-gray-700 rounded text-[9px] tracking-widest text-gray-400">HD</span>
        </div>

        <p class="hidden md:block mt-4 text-gray-400 text-sm md:text-base max-w-xl line-clamp-3 leading-relaxed drop-shadow">
          {{ heroMovie.overview || 'No synopsis available in this language.' }}
        </p>

        <div class="flex flex-wrap items-center gap-3 mt-5 md:mt-6">
          <NuxtLink 
            :to="`/movie/${heroMovie.id}/${slugify(heroMovie.title)}`" 
            class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm lg:text-base px-5 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 w-full sm:w-auto shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 md:w-5 h-5">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>
            Watch Now
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CONTENT SECTIONS GRID -->
    <main class="container mx-auto px-4 md:px-8 py-10 md:py-16 space-y-12 md:space-y-16 max-w-5xl">
      
      <!-- GRID 1: TRENDING MOVIES -->
      <section>
        <div class="flex items-center justify-between mb-5 md:mb-6 border-b border-white/[0.04] pb-4">
          <h2 class="text-base md:text-2xl font-black tracking-tight flex items-center gap-2 md:gap-3 text-white">
            <span class="w-1 h-5 md:w-1.5 md:h-7 bg-red-600 rounded-full"></span> 
            Trending Movies
          </h2>
          <NuxtLink to="/movie" class="text-xs md:text-sm font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group">
            View All <span class="group-hover:translate-x-1 transition-transform">→</span>
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          <NuxtLink 
            v-for="item in movies?.results.slice(0, 10)" 
            :key="item.id" 
            :to="`/movie/${item.id}/${slugify(item.title)}`" 
            @click="triggerAdsterra"
            class="group relative bg-gray-900/10 border border-white/[0.04] rounded-xl overflow-hidden hover:border-red-600/40 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl"
          >
            <div class="relative aspect-[2/3] overflow-hidden bg-gray-950">
              <img :src="`${imgUrl}${item.poster_path}`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" :alt="item.title" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90 group-hover:via-gray-950/30 transition-all"></div>
              
              <div class="absolute top-2 right-2 bg-gray-950/80 backdrop-blur-md text-yellow-500 font-bold text-[9px] md:text-xs px-1.5 py-0.5 rounded border border-gray-800 flex items-center gap-0.5 shadow">
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </div>

              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="p-2.5 md:p-3 bg-red-600 rounded-full text-white shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 md:w-6 md:h-6">
                    <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-2.5 md:p-3.5">
              <h3 class="font-bold text-xs md:text-sm tracking-tight line-clamp-1 text-gray-200 group-hover:text-red-500 transition-colors">
                {{ item.title }}
              </h3>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[10px] font-medium text-gray-500 block">{{ item.release_date?.split('-')[0] }}</span>
                <span class="text-[9px] px-1 py-0.2 uppercase border border-gray-800 rounded font-bold text-gray-400">HD</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- GRID 2: POPULAR TV SHOWS -->
      <section>
        <div class="flex items-center justify-between mb-5 md:mb-6 border-b border-white/[0.04] pb-4">
          <h2 class="text-base md:text-2xl font-black tracking-tight flex items-center gap-2 md:gap-3 text-white">
            <span class="w-1 h-5 md:w-1.5 md:h-7 bg-red-600 rounded-full"></span> 
            Popular TV Shows
          </h2>
          <NuxtLink to="/tv" class="text-xs md:text-sm font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group">
            View All <span class="group-hover:translate-x-1 transition-transform">→</span>
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          <NuxtLink 
            v-for="item in tvShows?.results.slice(0, 10)" 
            :key="item.id" 
            :to="`/tv/${item.id}/${slugify(item.name)}`" 
            @click="triggerAdsterra"
            class="group relative bg-gray-900/10 border border-white/[0.04] rounded-xl overflow-hidden hover:border-red-600/40 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl"
          >
            <div class="relative aspect-[2/3] overflow-hidden bg-gray-950">
              <img :src="`${imgUrl}${item.poster_path}`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" :alt="item.name" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90 group-hover:via-gray-950/30 transition-all"></div>
              
              <div class="absolute top-2 right-2 bg-gray-950/80 backdrop-blur-md text-yellow-500 font-bold text-[9px] md:text-xs px-1.5 py-0.5 rounded border border-gray-800 flex items-center gap-0.5 shadow">
                ⭐ {{ item.vote_average?.toFixed(1) }}
              </div>

              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="p-2.5 md:p-3 bg-red-600 rounded-full text-white shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 md:w-6 md:h-6">
                    <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-2.5 md:p-3.5">
              <h3 class="font-bold text-xs md:text-sm tracking-tight line-clamp-1 text-gray-200 group-hover:text-red-500 transition-colors">
                {{ item.name }}
              </h3>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[10px] font-medium text-gray-500 block">{{ item.first_air_date?.split('-')[0] }}</span>
                <span class="text-[9px] px-1 py-0.2 uppercase border border-gray-800 rounded font-bold text-gray-400">HD</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- PREMIUM EXPANDABLE KEYWORD SPACING SECTION (Mencegah Thin Content Google) -->
      <section class="pt-8 border-t border-white/[0.04]">
        <div class="relative transition-all duration-500 overflow-hidden" :class="isExpanded ? 'max-h-[1000px]' : 'max-h-24'">
          <div class="space-y-3 text-[11px] md:text-xs text-gray-500 leading-relaxed">
            <p>
              Welcome to <strong class="text-gray-400">JustPlay</strong>, the internet's premier digital streaming indexing matrix constructed to help you <strong class="text-gray-400">watch movies and TV shows online free</strong> in premium high-definition quality. Our systems scan and organize structural metadata updates directly from secure content databases, delivering real-time logs of the latest blockbuster motion pictures, independent cinema favorites, and highly-rated TV serial installments.
            </p>
            <p>
              By engineering dynamic layout models integrated with alternative cloud proxy networks, JustPlay ensures every streaming asset loads flawlessly. Explore curated entertainment segments sorted across popular genres including high-octane action, mind-bending science fiction, emotional dramas, and major ongoing network television broadcasts. No complex registrations or credit entries are required to access our data indexes.
            </p>
            <p>
              Our video embedding pipelines prioritize standard high-definition formats like <span class="text-red-500/70">Ultra HD, 1080p, and pristine BluRay rendering</span>. Combined with multi-language subtitle integrations and alternative proxy mirrors, you are guaranteed uninterrupted cinematic playback. Bookmark our core landing node today to receive instant notifications on freshly mapped media episodes and theatrical arrivals.
            </p>
          </div>
          <!-- Fade-out Overlay Effect -->
          <div v-if="!isExpanded" class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pointer-events-none"></div>
        </div>

        <button 
          @click="isExpanded = !isExpanded" 
          class="mt-3 text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          <span>{{ isExpanded ? 'Read Less ▲' : 'Show Site Description ▼' }}</span>
        </button>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const imgUrl = 'https://image.tmdb.org/t/p/w500'
const backdropUrl = 'https://image.tmdb.org/t/p/original'

// State Interaktif
const isExpanded = ref(false)

// Helper Pembuat Slug untuk URL SEO-Friendly
const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// Ambil Data TMDB Populer Secara Paralel
const [{ data: movies }, { data: tvShows }] = await Promise.all([
  useFetch('https://api.themoviedb.org/3/movie/popular', { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } }),
  useFetch('https://api.themoviedb.org/3/tv/popular', { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } })
])

// Set film pertama sebagai Hero Banner
const heroMovie = computed(() => {
  return movies.value?.results?.[0] || null
})

// SETUP SEO META PREMIUM GLOBAL FOR HOMEPAGE
useSeoMeta({
  title: 'JustPlay - Watch Movies & TV Shows Stream Online Free',
  description: 'Stream full movies and TV series online in HD quality for free on JustPlay. Explore massive library of streaming contents updated daily. No sign up required.',
  ogTitle: 'JustPlay - Watch Movies & TV Shows Stream Online Free',
  ogDescription: 'Stream full movies and TV series online in HD quality for free. Secure proxy, fast loading servers.',
  ogUrl: 'https://justplay.com',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

// SCHEMA MARKUP JSON-LD: WebSite & Organization untuk Kredibilitas di Mata Google Bot
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "JustPlay",
        "url": "https://justplay.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://justplay.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; filter: blur(4px); }
  to { opacity: 1; filter: blur(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>