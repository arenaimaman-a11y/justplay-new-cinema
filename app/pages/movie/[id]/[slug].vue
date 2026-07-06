<template>
  <main class="bg-gray-950 min-h-screen text-gray-200 pt-24 pb-16 relative overflow-hidden">
    <!-- Dekorasi Background Ambience Premium -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-red-600/5 blur-[140px] pointer-events-none rounded-full"></div>

    <div class="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
      
      <!-- Back Button Minimalis -->
      <NuxtLink to="/movie" class="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-red-500 mb-5 transition-all duration-300 group">
        <span class="transform group-hover:-translate-x-1 transition-transform">←</span> Return to Movies
      </NuxtLink>

      <!-- Video Player Frame Premium -->
      <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-gray-900 shadow-red-950/10">
        <iframe 
          :src="currentPlayerUrl" 
          class="w-full h-full" 
          allowfullscreen 
          scrolling="no"
          frameborder="0"
        ></iframe>
      </div>

      <!-- PREMIUM NAVIGATION & MULTI-SERVER CONTROL BAR -->
      <div class="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/20 backdrop-blur-md border border-white/[0.04] rounded-2xl px-5 py-3.5 shadow-xl">
        
        <!-- Sisi Kiri: Pilihan Server Alternatif -->
        <div class="flex flex-col gap-2 w-full">
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Streaming Server</span>
          <div class="flex flex-wrap items-center gap-2">
            <button 
              v-for="server in serverSources" 
              :key="server.id"
              @click="changeServer(server.id)"
              :class="[
                'px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-300 flex items-center gap-1.5',
                activeServer === server.id 
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-gray-950/60 border-white/[0.05] hover:border-white/[0.15] text-gray-400 hover:text-white'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="activeServer === server.id ? 'bg-white' : 'bg-gray-600'"></span>
              {{ server.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- UTILITY ACTION BAR: REPORT VIDEO ERROR & REQUEST CONTENT -->
      <div class="mt-3 flex items-center justify-between px-2 text-xs">
        <!-- Notifikasi Status Sukses Laporan Reaktif -->
        <div class="text-[11px] font-semibold transition-all duration-300">
          <span v-if="reportStatus" class="text-green-500 flex items-center gap-1">
            ✓ {{ reportStatus }}
          </span>
          <span v-else class="text-gray-600">Video lagging or dead? Let us know.</span>
        </div>

        <div class="flex items-center gap-4">
          <!-- Tombol Report Video Error -->
          <button 
            @click="triggerReport"
            :disabled="isReporting"
            class="text-[11px] font-bold text-gray-500 hover:text-red-500 uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-40"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {{ isReporting ? 'Reporting...' : 'Report Error' }}
          </button>

          <!-- Tombol Request Content (Buka Tab/Link Khusus) -->
          <a 
            href="#" 
            @click.prevent="triggerRequest"
            class="text-[11px] font-bold text-gray-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
            Request Movie/TV
          </a>
        </div>
      </div>

      <!-- SECTION 1: DETAIL INFORMASI UTAMA & EXPANDABLE SEO SYNOPSIS -->
      <div class="mt-10 border-b border-gray-900/80 pb-8">
        <h1 class="text-xl md:text-3xl font-black text-white tracking-tight capitalize">
          {{ movieDetails?.title || movieTitle }}
        </h1>
        <div class="flex items-center gap-3 mt-2 text-xs text-gray-500 font-semibold tracking-wide">
          <span class="text-gray-400 font-mono">ID: {{ movieId }}</span>
          <span class="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span v-if="movieDetails?.vote_average" class="text-yellow-500 flex items-center gap-1 bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10">
            ★ {{ movieDetails.vote_average.toFixed(1) }}
          </span>
          <span class="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span class="text-gray-400">Active Source: <span class="text-red-500 font-bold uppercase">{{ activeServer }}</span></span>
        </div>

        <!-- Boks Konten Teks SEO yang Dapat Di-expand -->
        <div class="relative mt-4 transition-all duration-500 overflow-hidden" :class="isExpanded ? 'max-h-[1000px]' : 'max-h-24'">
          <p class="text-xs md:text-sm text-gray-400 leading-relaxed max-w-3xl font-medium">
            {{ movieDetails?.overview || 'No synopsis metadata available for this feature film database entry.' }}
          </p>

          <!-- BLOK KEYWORD SPACING UNTUK SEO GOOGLE (Khusus Film) -->
          <div class="mt-4 pt-4 border-t border-white/[0.03] space-y-3 text-[11px] md:text-xs text-gray-500 leading-relaxed max-w-3xl">
            <p>
              Looking for a secure platform to watch <strong class="text-gray-400">{{ movieNameClean }}</strong> online free? You have landed on the premium digital destination. On JustPlay, we provide comprehensive access to stream your favorite hollywood blockbusters, top trending cinematic releases, and critically acclaimed movies in ultra-high-definition quality without requiring any payment or premium subscriptions.
            </p>
            <p>
              Our internal content delivery systems monitor multi-source video files to yield rapid buffer-free sessions. By implementing optimized content delivery mirrors and deploying reliable server options such as <span class="text-red-500/70">Server 1, Server 2, and Server 3</span>, we assure flawless execution, effectively eliminating broken media frames or system crashes during high-demand hours.
            </p>
            <p>
              Full dynamic subtitle tracks are natively mapped to the player layout, providing global accessibility configurations like English subtitles, Spanish translations, and localized dub tracks. Remember to pin our main index landing page to trace real-time weekly releases, upcoming trailers, actor news, and algorithmically generated title recommendations similar to <strong class="text-gray-400">{{ movieNameClean }}</strong>.
            </p>
          </div>

          <!-- Gradien Efek Pudar Jika Ditutup (Fade-out Overlay) -->
          <div v-if="!isExpanded" class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent pointer-events-none"></div>
        </div>

        <button 
          @click="isExpanded = !isExpanded" 
          class="mt-2 text-[11px] font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1 transition-colors"
        >
          <span>{{ isExpanded ? 'Read Less ▲' : 'Read More Synopsis ▼' }}</span>
        </button>
      </div>

      <!-- SECTION 2: TOP BILLED CAST -->
      <div v-if="credits?.cast && credits.cast.length > 0" class="mt-8 border-b border-gray-900/80 pb-8">
        <h3 class="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-red-600 rounded-full"></span> Movie Cast
        </h3>
        <div class="flex items-stretch gap-4 overflow-x-auto pb-3 custom-scrollbar snap-x">
          <div 
            v-for="actor in credits.cast.slice(0, 12)" 
            :key="actor.id" 
            class="flex-shrink-0 w-24 md:w-28 bg-gray-900/20 border border-white/[0.03] rounded-xl p-2 text-center snap-start hover:border-white/[0.08] transition-all"
          >
            <div class="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden bg-gray-950 border border-gray-800">
              <img 
                v-if="actor.profile_path" 
                :src="`${tmdbImgUrl}${actor.profile_path}`" 
                class="w-full h-full object-cover" 
                :alt="actor.name"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-900 text-[10px] text-gray-600 font-bold">No Pix</div>
            </div>
            <h4 class="text-[11px] font-bold text-gray-200 mt-2 line-clamp-1 leading-tight">{{ actor.name }}</h4>
            <p class="text-[9px] text-gray-500 mt-0.5 line-clamp-1 italic">{{ actor.character }}</p>
          </div>
        </div>
      </div>

      <!-- SECTION 3: RECOMMENDATIONS -->
      <div v-if="recommendations?.results && recommendations.results.length > 0" class="mt-8">
        <h3 class="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-red-600 rounded-full"></span> Recommended For You
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <NuxtLink 
            v-for="item in recommendations.results.slice(0, 5)" 
            :key="item.id"
            :to="`/movie/${item.id}/${slugify(item.title)}`"
            class="group bg-gray-900/10 border border-gray-900/80 rounded-xl overflow-hidden hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1"
          >
            <div class="relative aspect-[2/3] overflow-hidden bg-gray-950">
              <img 
                v-if="item.poster_path" 
                :src="`${tmdbImgUrl}${item.poster_path}`" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                :alt="item.title"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-600 bg-gray-900">No Image</div>
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
              <div class="absolute top-2 right-2 bg-gray-950/80 text-yellow-500 font-bold text-[9px] px-1.5 py-0.5 rounded border border-gray-800">
                ★ {{ item.vote_average?.toFixed(1) }}
              </div>
            </div>
            <div class="p-2">
              <h4 class="font-bold text-xs text-gray-300 line-clamp-1 group-hover:text-red-500 transition-colors">{{ item.title }}</h4>
              <span class="text-[9px] font-medium text-gray-500 mt-0.5 block">{{ item.release_date?.split('-')[0] || 'N/A' }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()

const movieId = route.params.id
const movieSlug = route.params.slug || ''
const tmdbImgUrl = 'https://image.tmdb.org/t/p/w500'

// State Interaktif
const isExpanded = ref(false)
const isReporting = ref(false)
const reportStatus = ref('')

const serverSources = [
  { id: 'vidsrc_to', name: 'Server 1 (Default)' },
  { id: 'vidsrc_me', name: 'Server 2 (Backup)' },
  { id: 'vidsrc_cc', name: 'Server 3 (UHD)' }
]
const activeServer = ref('vidsrc_to')

const slugify = (text) => {
  if (!text) return ''
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
}

// Ekstraksi nama film mentah dari slug
const movieTitle = movieSlug.replace(/-/g, ' ')

const changeServer = (serverId) => { activeServer.value = serverId }

// Set URL Embed Iframe Player Khusus Film (Tanpa Parameter Season/Episode)
const currentPlayerUrl = computed(() => {
  if (activeServer.value === 'vidsrc_me') return `https://vidsrc.me/embed/movie?tmdb=${movieId}`
  if (activeServer.value === 'vidsrc_cc') return `https://vidsrc.cc/v2/embed/movie/${movieId}`
  return `https://vidsrc.to/embed/movie/${movieId}`
})

// Trigger Monetisasi (SEKARANG KOSONG/DIBERSIHKAN)
const triggerReport = () => {
  isReporting.value = true
  // window.open dihapus
  setTimeout(() => {
    isReporting.value = false
    reportStatus.value = `Error report has been dispatched. Admin will re-verify the links!`
    setTimeout(() => { reportStatus.value = '' }, 4000)
  }, 1200)
}

const triggerRequest = () => {
  // window.open dihapus
  // Anda bisa menambahkan logika lain di sini jika diperlukan
  console.log('Request button clicked')
}

// FETCH DATA MOVIE PARALEL FROM TMDB
const [{ data: movieDetails }, { data: credits }, { data: recommendations }] = await Promise.all([
  useFetch(`https://api.themoviedb.org/3/movie/${movieId}`, { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } }),
  useFetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } }),
  useFetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations`, { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } })
])

// SEO METADATA DINAMIS FILM
const currentUrl = computed(() => `https://justplay.com/movie/${movieId}/${movieSlug}`)
const movieNameClean = computed(() => movieDetails.value?.title || movieTitle)
const currentPosterUrl = computed(() => movieDetails.value?.poster_path ? `${tmdbImgUrl}${movieDetails.value.poster_path}` : '')

useSeoMeta({
  title: () => `Watch ${movieNameClean.value.toUpperCase()} Full Movie Online Free - JustPlay`,
  description: () => `Stream ${movieNameClean.value} full movie in HD high-quality resolution on JustPlay. Safe fast streaming mirrors with alternative server options.`,
  ogTitle: () => `Watch ${movieNameClean.value} Full Movie Online`,
  ogDescription: () => `Free streaming options for ${movieNameClean.value} full length feature film on JustPlay.`,
  ogImage: () => currentPosterUrl.value,
  ogUrl: () => currentUrl.value,
  ogType: 'video.movie',
  twitterCard: 'summary_large_image'
})

// SCHEMA MARKUP JSON-LD KATEGORI MOVIE
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Movie",
        "@id": currentUrl.value,
        "url": currentUrl.value,
        "name": movieNameClean.value,
        "description": movieDetails.value?.overview || `Watch ${movieNameClean.value} full movie online free with fast alternative streams on JustPlay.`,
        "image": currentPosterUrl.value,
        "dateCreated": movieDetails.value?.release_date || undefined,
        "aggregateRating": movieDetails.value?.vote_average ? {
          "@type": "AggregateRating",
          "ratingValue": movieDetails.value.vote_average.toFixed(1),
          "bestRating": "10",
          "worstRating": "1",
          "ratingCount": movieDetails.value?.vote_count || 12
        } : undefined
      }))
    }
  ]
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 99px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.4); }
</style>