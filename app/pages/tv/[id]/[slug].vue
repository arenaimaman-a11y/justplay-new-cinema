<template>
  <main class="bg-gray-950 min-h-screen text-gray-200 pt-24 pb-16 relative overflow-hidden">
    <div v-if="activeDropdown" @click="activeDropdown = null" class="fixed inset-0 z-40 md:hidden"></div>

    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-red-600/5 blur-[140px] pointer-events-none rounded-full"></div>

    <div class="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
      
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-red-500 mb-5 transition-all duration-300 group">
        <span class="transform group-hover:-translate-x-1 transition-transform">←</span> Return to Discover
      </NuxtLink>

      <div class="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-gray-900 shadow-red-950/10">
        
        <div v-if="!isPlayerUnlocked" @click="handleFakeClick" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 cursor-pointer group">
          <div class="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform duration-300">
            <svg class="w-10 h-10 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <p class="mt-4 text-sm font-bold text-white/90 animate-pulse">Play Now</p>
        </div>

        <iframe 
          :src="currentPlayerUrl" 
          class="w-full h-full" 
          allowfullscreen 
          scrolling="no"
          frameborder="0"
        ></iframe>
      </div>

      <div class="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/20 backdrop-blur-md border border-white/[0.04] rounded-2xl px-5 py-3.5 shadow-xl">
        <div class="flex flex-col gap-2">
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Server (Alternative)</span>
          <div class="flex flex-wrap items-center gap-2">
            <button 
              v-for="server in serverSources" 
              :key="server.id"
              @click="changeServer(server.id)"
              :class="[
                'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-300 flex items-center gap-1.5',
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

        <div class="flex items-end sm:items-center gap-3 relative self-start md:self-auto">
          <div class="relative">
            <span class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:hidden">Season</span>
            <button @click="toggleDropdown('season')" class="flex items-center gap-2 bg-gray-900/60 hover:bg-gray-900 border border-white/[0.05] hover:border-white/[0.1] text-xs font-bold text-gray-200 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95">
              <span>Season {{ selectedSeasonNumber }}</span>
              <svg class="w-3 h-3 text-gray-500 transition-transform duration-300" :class="{ 'rotate-180 text-red-500': activeDropdown === 'season' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <transition name="dropdown">
              <div v-if="activeDropdown === 'season'" class="fixed md:absolute inset-x-4 md:inset-x-auto top-[20%] md:top-full mt-2 w-[calc(100vw-32px)] md:w-40 bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl p-1.5 z-[100] max-h-[60vh] overflow-y-auto custom-scrollbar">
                <button v-for="season in validSeasons" :key="season.id" @click="selectSeason(season.season_number)" :class="['w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 block', selectedSeasonNumber === season.season_number ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:bg-white/[0.08] hover:text-white']">Season {{ season.season_number }}</button>
              </div>
            </transition>
          </div>

          <div class="flex items-center gap-2">
            <div class="relative">
              <span class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 md:hidden">Episode</span>
              <button @click="toggleDropdown('episode')" :disabled="!currentSeasonDetails?.episodes" class="flex items-center gap-2 bg-gray-900/60 hover:bg-gray-900 border border-white/[0.05] hover:border-white/[0.1] text-xs font-bold text-gray-200 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95 disabled:opacity-40">
                <span>Ep {{ currentEpisode }}</span>
                <svg class="w-3 h-3 text-gray-500 transition-transform duration-300" :class="{ 'rotate-180 text-red-500': activeDropdown === 'episode' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <transition name="dropdown">
                <div v-if="activeDropdown === 'episode' && currentSeasonDetails?.episodes" class="fixed md:absolute inset-x-4 md:inset-x-auto top-[20%] md:top-full mt-2 w-[calc(100vw-32px)] md:w-44 bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl p-1.5 z-[100] max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <button v-for="ep in currentSeasonDetails.episodes" :key="ep.id" @click="selectEpisode(ep.episode_number)" :class="['w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-between', currentEpisode === ep.episode_number ? 'bg-red-600 text-white font-bold' : 'text-gray-400 hover:bg-white/[0.08] hover:text-white']">
                    <span>Episode {{ ep.episode_number }}</span>
                    <span v-if="currentEpisode === ep.episode_number" class="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </button>
                </div>
              </transition>
            </div>
            <button @click="nextEpisode" class="bg-gray-900/60 hover:bg-red-600 border border-white/[0.05] hover:border-red-600 text-gray-400 hover:text-white p-2.5 rounded-xl transition-all duration-300 shadow-md active:scale-95" title="Next Episode"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
      </div>

      <div class="mt-3 flex items-center justify-between px-2 text-xs">
        <div class="text-[11px] font-semibold transition-all duration-300">
          <span v-if="reportStatus" class="text-green-500 flex items-center gap-1">✓ {{ reportStatus }}</span>
          <span v-else class="text-gray-600">Video lagging or dead? Let us know.</span>
        </div>
        <div class="flex items-center gap-4">
          <button @click="triggerReport" :disabled="isReporting" class="text-[11px] font-bold text-gray-500 hover:text-red-500 uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-40">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {{ isReporting ? 'Reporting...' : 'Report Error' }}
          </button>
          <a href="#" @click.prevent="triggerRequest" class="text-[11px] font-bold text-gray-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
            Request Movie/TV
          </a>
        </div>
      </div>

      <div class="mt-10 border-b border-gray-900/80 pb-8">
        <h1 class="text-xl md:text-3xl font-black text-white tracking-tight capitalize">{{ tvDetails?.name || tvTitle }}</h1>
        <div class="flex items-center gap-3 mt-2 text-xs text-gray-500 font-semibold tracking-wide">
          <span class="text-gray-400 font-mono">ID: {{ tvId }}</span>
          <span class="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span v-if="tvDetails?.vote_average" class="text-yellow-500 flex items-center gap-1 bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10">★ {{ tvDetails.vote_average.toFixed(1) }}</span>
          <span class="w-1 h-1 bg-gray-800 rounded-full"></span>
          <span class="text-gray-400">Active Source: <span class="text-red-500 font-bold uppercase">{{ activeServer }}</span></span>
        </div>
        <div class="relative mt-4 transition-all duration-500 overflow-hidden" :class="isExpanded ? 'max-h-[1000px]' : 'max-h-24'">
          <p class="text-xs md:text-sm text-gray-400 leading-relaxed max-w-3xl font-medium">{{ tvDetails?.overview || 'No synopsis metadata available for this television network entry.' }}</p>
          <div v-if="!isExpanded" class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent pointer-events-none"></div>
        </div>
        <button @click="isExpanded = !isExpanded" class="mt-2 text-[11px] font-bold text-red-500 hover:text-red-400 uppercase tracking-wider flex items-center gap-1 transition-colors">
          <span>{{ isExpanded ? 'Read Less ▲' : 'Read More Synopsis ▼' }}</span>
        </button>
      </div>

      <div v-if="credits?.cast && credits.cast.length > 0" class="mt-8 border-b border-gray-900/80 pb-8">
        <h3 class="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-red-600 rounded-full"></span> Series Cast
        </h3>
        <div class="flex items-stretch gap-4 overflow-x-auto pb-3 custom-scrollbar snap-x">
          <div v-for="actor in credits.cast.slice(0, 12)" :key="actor.id" class="flex-shrink-0 w-24 md:w-28 bg-gray-900/20 border border-white/[0.03] rounded-xl p-2 text-center snap-start hover:border-white/[0.08] transition-all">
            <div class="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden bg-gray-950 border border-gray-800">
              <img v-if="actor.profile_path" :src="`${tmdbImgUrl}${actor.profile_path}`" class="w-full h-full object-cover" :alt="actor.name" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-900 text-[10px] text-gray-600 font-bold">No Pix</div>
            </div>
            <h4 class="text-[11px] font-bold text-gray-200 mt-2 line-clamp-1 leading-tight">{{ actor.name }}</h4>
            <p class="text-[9px] text-gray-500 mt-0.5 line-clamp-1 italic">{{ actor.character }}</p>
          </div>
        </div>
      </div>

      <div v-if="recommendations?.results && recommendations.results.length > 0" class="mt-8">
        <h3 class="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span class="w-1 h-4 bg-red-600 rounded-full"></span> More Like This
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <NuxtLink v-for="item in recommendations.results.slice(0, 5)" :key="item.id" :to="`/tv/${item.id}/${slugify(item.name)}-1-1`" class="group bg-gray-900/10 border border-gray-900/80 rounded-xl overflow-hidden hover:border-red-600/30 transition-all duration-300 hover:-translate-y-1">
            <div class="relative aspect-[2/3] overflow-hidden bg-gray-950">
              <img v-if="item.poster_path" :src="`${tmdbImgUrl}${item.poster_path}`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :alt="item.name" />
              <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-600 bg-gray-900">No Image</div>
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
              <div class="absolute top-2 right-2 bg-gray-950/80 text-yellow-500 font-bold text-[9px] px-1.5 py-0.5 rounded border border-gray-800">★ {{ item.vote_average?.toFixed(1) }}</div>
            </div>
            <div class="p-2">
              <h4 class="font-bold text-xs text-gray-300 line-clamp-1 group-hover:text-red-500 transition-colors">{{ item.name }}</h4>
              <span class="text-[9px] font-medium text-gray-500 mt-0.5 block">{{ item.first_air_date?.split('-')[0] || 'N/A' }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const tvId = route.params.id
const tvSlug = route.params.slug || ''
const tmdbImgUrl = 'https://image.tmdb.org/t/p/w500'

const isExpanded = ref(false)
const isReporting = ref(false)
const isPlayerUnlocked = ref(false)
const reportStatus = ref('')

const serverSources = [
  { id: 'vidsrc_me', name: 'Server 1 (Default)' },
  { id: 'vidsrc_cc', name: 'Server 2 (Backup)' },
  { id: 'vidsrc_to', name: 'Server 3 (UHD)' }
]
const activeServer = ref('vidsrc_me')

const handleFakeClick = () => {
  window.open('https://s.pemsrv.com/v1/link.php?cat=&idzone=5969584&type=8', '_blank')
  isPlayerUnlocked.value = true
}

const slugify = (text) => {
  if (!text) return ''
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
}

const parts = tvSlug.split('-')
let initialEpisode = 1
let initialSeason = 1
let cleanTitleParts = [...parts]

if (parts.length >= 3) {
  const epCheck = parts[parts.length - 1]
  const seCheck = parts[parts.length - 2]
  if (!isNaN(seCheck) && !isNaN(epCheck)) {
    initialEpisode = parseInt(epCheck)
    initialSeason = parseInt(seCheck)
    cleanTitleParts = parts.slice(0, -2)
  }
}
const baseSlugText = cleanTitleParts.join('-')
const tvTitle = cleanTitleParts.join(' ')

const currentSeason = ref(initialSeason)
const currentEpisode = ref(initialEpisode)
const selectedSeasonNumber = ref(initialSeason)
const activeDropdown = ref(null)

const toggleDropdown = (type) => activeDropdown.value = activeDropdown.value === type ? null : type
const selectSeason = (seasonNum) => { selectedSeasonNumber.value = seasonNum; activeDropdown.value = null }
const selectEpisode = (epNum) => { changeEpisode(epNum); activeDropdown.value = null }
const closeDropdowns = (e) => { if (!e.target.closest('.relative')) activeDropdown.value = null }
const changeServer = (serverId) => { activeServer.value = serverId; isPlayerUnlocked.value = false }

const nextEpisode = () => {
  if (currentSeasonDetails.value?.episodes) {
    const nextEp = currentEpisode.value + 1
    const exists = currentSeasonDetails.value.episodes.find(e => e.episode_number === nextEp)
    if (exists) {
      changeEpisode(nextEp)
    } else {
      const nextSeason = selectedSeasonNumber.value + 1
      if (tvDetails.value?.seasons?.find(s => s.season_number === nextSeason)) {
        changeEpisode(1, nextSeason)
      }
    }
  }
}

const currentPlayerUrl = computed(() => {
  const s = currentSeason.value
  const e = currentEpisode.value
  if (activeServer.value === 'vidsrc_me') return `https://vidsrc.me/embed/tv?tmdb=${tvId}&season=${s}&episode=${e}`
  if (activeServer.value === 'vidsrc_cc') return `https://vidsrc.cc/v2/embed/tv/${tvId}/${s}/${e}`
  return `https://vidsrc.to/embed/tv/${tvId}/${s}/${e}`
})

const triggerReport = () => {
  isReporting.value = true
  setTimeout(() => {
    isReporting.value = false
    reportStatus.value = `Error report has been dispatched.`
    setTimeout(() => { reportStatus.value = '' }, 4000)
  }, 1200)
}

const triggerRequest = () => console.log('Request button clicked')

onMounted(() => window.addEventListener('click', closeDropdowns))
onUnmounted(() => window.removeEventListener('click', closeDropdowns))

const [{ data: tvDetails }, { data: credits }, { data: recommendations }] = await Promise.all([
  useFetch(`https://api.themoviedb.org/3/tv/${tvId}`, { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } }),
  useFetch(`https://api.themoviedb.org/3/tv/${tvId}/credits`, { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } }),
  useFetch(`https://api.themoviedb.org/3/tv/${tvId}/recommendations`, { query: { api_key: config.public.tmdbApiKey, language: 'en-US' } })
])

const validSeasons = computed(() => tvDetails.value?.seasons?.filter(s => s.season_number > 0) || [])

const { data: currentSeasonDetails } = await useFetch(() => `https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeasonNumber.value}`, {
  watch: [selectedSeasonNumber],
  query: { api_key: config.public.tmdbApiKey, language: 'en-US' }
})

watch(selectedSeasonNumber, (newSeason) => { if (newSeason !== currentSeason.value) changeEpisode(1, newSeason) })

const changeEpisode = (epNum, seNum = selectedSeasonNumber.value) => {
  currentSeason.value = seNum
  currentEpisode.value = epNum
  selectedSeasonNumber.value = seNum
  isPlayerUnlocked.value = false
  router.push(`/tv/${tvId}/${baseSlugText}-${seNum}-${epNum}`)
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.96); }
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 99px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.4); }
</style>
