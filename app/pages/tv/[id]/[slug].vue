<template>
  <main class="bg-gray-950 min-h-screen text-gray-200 pt-28 md:pt-32 pb-16 relative z-10 overflow-hidden select-none">
    <!-- Ambient Blur Background -->
    <div class="hero-blur-backdrop" :style="backdropStyle"></div>

    <div class="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">

      <!-- Player Section -->
      <div class="mb-4">
        <div class="player-outer-glow">
          <div class="custom-video-ratio-box shadow-2xl">
            <ClientOnly>
              <iframe  
                :key="`player-${tvId}-${currentSeason}-${currentEpisode}`"
                :src="currentPlayerUrl" 
                allowfullscreen
                scrolling="no"
                allow="autoplay; encrypted-media"
                class="core-iframe-player"
              >
              </iframe>
            </ClientOnly>
          </div>
        </div>
      </div>
        <!-- SERVER SELECTOR BUTTONS -->
    <div class="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
      <span class="text-xs font-semibold text-gray-400 mr-2">Server:</span>
      <button
        v-for="(provider, index) in providers"
        :key="provider.name"
        @click="selectedProviderIndex = index"
        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
        :class="selectedProviderIndex === index 
          ? 'bg-[var(--brand-red)] text-white border-transparent shadow-lg shadow-red-900/30' 
          : 'bg-gray-900/80 text-gray-400 border-white/10 hover:text-white hover:border-white/20'"
      >
        {{ provider.name }}
      </button>
    </div>
    <!-- NOTICE / WARNING MESSAGE BELOW SERVER -->
    <div class="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-amber-400 text-xs font-medium">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <span>This media is unavailable at the moment. Please select another server.</span>
    </div>
      <!-- COMPACT SEASON & EPISODE SELECTOR (Dropdowns) -->
      <div class="bg-gray-900/60 backdrop-blur-md border border-white/[0.08] rounded-xl p-2.5 shadow-xl grid grid-cols-2 sm:flex sm:items-center gap-2.5">
        
        <!-- Dropdown Season -->
        <div class="relative w-full sm:w-auto sm:min-w-[140px]">
          <label class="block text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider px-0.5">Season</label>
          <div class="relative">
            <select 
              v-model="selectedSeasonNumber" 
              @change="onSeasonChange"
              class="w-full bg-gray-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold brand-red-text focus:outline-none focus:border-[var(--brand-red)] cursor-pointer appearance-none pr-8 transition-colors"
            >
              <option 
                v-for="season in validSeasons" 
                :key="season.id" 
                :value="season.season_number"
                class="bg-gray-900 text-gray-200"
              >
                Season {{ season.season_number }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 text-[10px]">▼</div>
          </div>
        </div>

        <!-- Dropdown Episode -->
        <div class="relative w-full sm:w-auto sm:min-w-[160px]">
          <label class="block text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider px-0.5">Episode</label>
          <div class="relative">
            <select 
              v-model="currentEpisode"
              class="w-full bg-gray-950/80 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[var(--brand-red)] cursor-pointer appearance-none pr-8 transition-colors disabled:opacity-50"
              :disabled="!currentSeasonDetails?.episodes?.length"
            >
              <template v-if="currentSeasonDetails?.episodes?.length">
                <option 
                  v-for="ep in currentSeasonDetails.episodes" 
                  :key="ep.id" 
                  :value="ep.episode_number"
                  class="bg-gray-900 text-gray-200"
                >
                  Episode {{ ep.episode_number }}
                </option>
              </template>
              <option v-else value="" class="bg-gray-900 text-gray-400">Memuat...</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400 text-[10px]">▼</div>
          </div>
        </div>

      </div>

      <!-- Detail Info -->
      <div class="mt-6 border-b border-gray-900/80 pb-6">
        <h1 class="text-xl md:text-3xl font-black text-white tracking-tight capitalize">{{ tvDetails?.name || tvTitle }}</h1>
        
        <!-- Season & Episode Label Badge -->
        <div class="flex items-center gap-3 mt-2 text-xs text-gray-500 font-semibold tracking-wide">
          <span class="brand-badge px-2.5 py-1 rounded font-mono font-bold">
            Season {{ currentSeason }} — Episode {{ currentEpisode }}
          </span>
          <span v-if="tvDetails?.vote_average" class="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span v-if="tvDetails?.vote_average" class="text-yellow-500 flex items-center gap-1 bg-yellow-500/5 px-2 py-1 rounded border border-yellow-500/10">★ {{ tvDetails.vote_average.toFixed(1) }}</span>
        </div>

        <!-- Dynamic Synopsis (Per Episode) -->
        <div class="relative mt-4 transition-all duration-500 overflow-hidden" :class="isExpanded ? 'max-h-[1000px]' : 'max-h-24'">
          <p class="text-xs md:text-sm text-gray-400 leading-relaxed max-w-3xl font-medium">
            {{ activeOverview }}
          </p>
          <div v-if="!isExpanded" class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent pointer-events-none"></div>
        </div>
        <button @click="isExpanded = !isExpanded" class="mt-2 text-[11px] font-bold brand-red-text hover:brightness-125 uppercase tracking-wider flex items-center gap-1 transition-all">
          <span>{{ isExpanded ? 'Read Less ▲' : 'Read More Synopsis ▼' }}</span>
        </button>
      </div>

      <!-- COPYRIGHT & DMCA DISCLAIMER -->
      <footer class="mt-10 pt-6 border-t border-white/5 text-center text-[11px] text-gray-500 leading-relaxed">
        <p class="mb-2">
          <span class="font-bold text-gray-400">ADS:</span>
        </p>
        <p class="text-gray-600">
          © {{ currentYear }} JustPlay. All rights reserved.
        </p>
      </footer>

    </div>
    <!-- ADBLUEMEDIA CONTENT LOCKER POPUP -->
    <Teleport to="body">
      <div 
        v-if="showLockerModal && !isUnlocked" 
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none"
      >
        <div class="bg-gray-900 border border-red-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl relative">
          <!-- Icon Lock -->
          <div class="mx-auto w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-500">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>

          <h2 class="text-xl md:text-2xl font-black text-white tracking-tight mb-2">
            Action Required
          </h2>
          
          <p class="text-xs md:text-sm text-gray-400 mb-6 leading-relaxed">
            To continue watching, please complete a quick offer below. The video will resume automatically once completed.
          </p>

          <!-- TOMBOL / CONTAINER OFFER ADBLUEMEDIA -->
          <div class="space-y-3">
            <button 
              @click="openAdBlueMediaOffer" 
              class="w-full py-3.5 px-4 bg-[var(--brand-red)] hover:brightness-110 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/40 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Complete Survey to Unlock</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>

          <p class="text-[10px] text-gray-500 mt-4">
            This unlock is required only once per browser session.
          </p>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()

const tvId = route.params.id
const tvSlug = route.params.slug || ''
const tmdbImgUrl = 'https://image.tmdb.org/t/p/original'

const isExpanded = ref(false)
const currentYear = new Date().getFullYear()

// --- LOGIKA LOCKER POPUP (ADBLUEMEDIA + UPSTASH REDIS) ---
const showLockerModal = ref(false)
const isUnlocked = ref(false)
const userSubId = ref('')
let timer = null
let pollInterval = null

// Smartlink AdBlueMedia Anda
const BASE_SMARTLINK = 'https://app.hawktrk.com/sl?id=6a2050db46d3cf0d62f32aa4&pid=2&sub2=u789901&sub6=s2smartLink&sub5=s1Tonz'

onMounted(() => {
  // 1. Cek apakah pengguna sudah pernah menyelesaikan survei
  const completed = localStorage.getItem('adbluemedia_completed')
  const lockTriggered = localStorage.getItem('adbluemedia_locked')

  if (completed === 'true') {
    isUnlocked.value = true
    return
  }

  // 2. Ambil atau Buat Sub ID Unik Pengunjung
  let localId = localStorage.getItem('user_sub_id')
  if (!localId) {
    localId = 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
    localStorage.setItem('user_sub_id', localId)
  }
  userSubId.value = localId

  // 3. Pemicu Penguncian
  if (lockTriggered === 'true') {
    triggerLock()
    // LANGSUNG JALANKAN POLLING jika halaman di-refresh dalam kondisi terkunci
    startPollingCompletion()
  } else {
    // Timer 2 menit sebelum mengunci
    timer = setTimeout(() => {
      triggerLock()
      startPollingCompletion()
    }, 120000)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (pollInterval) clearInterval(pollInterval)
})

// Fungsi Pemicu penguncian
const triggerLock = () => {
  if (isUnlocked.value) return

  if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }

  localStorage.setItem('adbluemedia_locked', 'true')
  showLockerModal.value = true
}

// Buka Offer Link + Buka Tab Baru
const openAdBlueMediaOffer = () => {
  const fullOfferUrl = `${BASE_SMARTLINK}&sub5=${userSubId.value}`
  window.open(fullOfferUrl, '_blank')
  
  // Pastikan Polling Berjalan Saat Tombol Diklik
  startPollingCompletion()
}

// Fungsi Polling Mengecek Status Ke Server Nuxt / Upstash Redis
const startPollingCompletion = () => {
  if (pollInterval) clearInterval(pollInterval)

  console.log('[Polling] Mulai mengecek status untuk ID:', userSubId.value)

  pollInterval = setInterval(async () => {
    try {
      if (!userSubId.value) return

      const res = await $fetch('/api/adblue-postback', {
        method: 'GET',
        query: { check_subid: userSubId.value }
      })

      console.log('[Polling] Respon server:', res)

      if (res && (res.completed === true || res.completed === 'true')) {
        console.log('[Polling] Konversi Berhasil! Menutup Popup...')
        clearInterval(pollInterval)
        completeUnlock()
      }
    } catch (err) {
      console.error('[Polling] Error saat mengecek status:', err)
    }
  }, 3000)
}

// Fungsi Buka Kunci Permanen
const completeUnlock = () => {
  localStorage.setItem('adbluemedia_completed', 'true')
  localStorage.removeItem('adbluemedia_locked')
  isUnlocked.value = true
  showLockerModal.value = false
}

// --- PARSING METADATA & PROVIDER PLAYER ---
const parts = tvSlug.split('-')
let urlEpisode = parseInt(route.query.e) || null
let urlSeason = parseInt(route.query.s) || null
let cleanTitleParts = [...parts]

if (parts.length >= 3) {
  const epCheck = parts[parts.length - 1]
  const seCheck = parts[parts.length - 2]
  if (!isNaN(seCheck) && !isNaN(epCheck)) {
    if (!urlEpisode) urlEpisode = parseInt(epCheck)
    if (!urlSeason) urlSeason = parseInt(seCheck)
    cleanTitleParts = parts.slice(0, -2)
  }
}
const tvTitle = cleanTitleParts.join(' ')

const { data: tvDetails } = await useFetch(`https://api.themoviedb.org/3/tv/${tvId}`, { 
  query: { api_key: config.public.tmdbApiKey, language: 'en-US' } 
})

const validSeasons = computed(() => tvDetails.value?.seasons?.filter(s => s.season_number > 0) || [])

const initialSeason = urlSeason || 1
const initialEpisode = urlEpisode || 1

const selectedSeasonNumber = ref(initialSeason)
const currentSeason = ref(initialSeason)
const currentEpisode = ref(initialEpisode)

const { data: currentSeasonDetails } = await useFetch(() => `https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeasonNumber.value}`, {
  watch: [selectedSeasonNumber],
  query: { api_key: config.public.tmdbApiKey, language: 'en-US' }
})

const selectedProviderIndex = ref(0)
const providers = [
  {
    name: 'Server 1 (VidSrc)',
    getUrl: (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}&autoplay=1`
  },
  {
    name: 'Server 2 (VidSrc.cc)',
    getUrl: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
  },
  {
    name: 'Server 3 (2Embed)',
    getUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
  },
  {
    name: 'Server 4 (AutoEmbed)',
    getUrl: (id, s, e) => `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`
  }
]

const currentPlayerUrl = computed(() => {
  const provider = providers[selectedProviderIndex.value] || providers[0]
  return provider.getUrl(tvId, currentSeason.value, currentEpisode.value)
})

const activeOverview = computed(() => {
  const epData = currentSeasonDetails.value?.episodes?.find(e => e.episode_number === currentEpisode.value)
  if (epData && epData.overview) {
    return epData.overview
  }
  return tvDetails.value?.overview || 'No synopsis metadata available for this episode.'
})

const backdropStyle = computed(() => {
  if (tvDetails.value?.backdrop_path) {
    return { backgroundImage: `linear-gradient(to bottom, rgba(8,9,12,0.65) 0%, #08090c 100%), url(${tmdbImgUrl}${tvDetails.value.backdrop_path})` }
  }
  return { backgroundColor: '#08090c' }
})

const onSeasonChange = () => {
  currentSeason.value = selectedSeasonNumber.value
  currentEpisode.value = 1
}
</script>

<style scoped>
/* VARIABLE WARNA UTAMA (Ubah kode hex di bawah sesuai hex merah logo JustPlay Anda) */
:deep(*) {
  --brand-red: #ff0033; /* Ganti kode hex ini dengan hex merah logo JustPlay */
}

.brand-red-text {
  color: var(--brand-red);
}

.brand-badge {
  color: var(--brand-red);
  background-color: rgba(255, 0, 51, 0.1);
  border: 1px solid rgba(255, 0, 51, 0.2);
}

/* PLAYER CONTAINER STYLING */
.custom-video-ratio-box { 
  position: relative; 
  width: 100%; 
  padding-top: 56.25%; 
  background: #000000; 
  border: 1px solid rgba(255, 255, 255, 0.06); 
  border-radius: 12px; 
  overflow: hidden; 
}

.player-outer-glow { 
  position: relative; 
  width: 100%; 
}

.player-outer-glow::before { 
  content: ''; 
  position: absolute; 
  top: 5%; 
  left: 2%; 
  width: 96%; 
  height: 90%; 
  background: var(--brand-red); 
  opacity: 0.12;
  filter: blur(50px); 
  z-index: -1; 
  pointer-events: none; 
}

.core-iframe-player { 
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100% !important; 
  height: 100% !important; 
  border: none; 
  z-index: 2; 
}

.hero-blur-backdrop { 
  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 450px; 
  background-size: cover; 
  background-position: center top; 
  filter: blur(60px); 
  opacity: 0.2; 
  z-index: 1; 
  pointer-events: none; 
}
</style>
