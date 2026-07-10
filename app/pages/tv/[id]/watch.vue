<template>
  <div class="watch-page-wrapper text-white">
    <div class="hero-blur-backdrop" :style="backdropStyle"></div>

    <div class="watch-container space-top-safe">
      
      <div class="section-row mb-3">
        <button @click="$router.push(detailsPageUrl)" class="btn-back-custom">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Details
        </button>
      </div>

      <div class="section-row mb-4">
        <h1 class="movie-main-title">{{ tvDetails?.name || 'Loading Video...' }}</h1>
        <div class="meta-flex-group">
          <span class="badge-streaming">NOW STREAMING</span>
          <span class="meta-pill-item">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            Season {{ currentSeason }}
          </span>
          <span class="meta-pill-item">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polygon points="12 6 12 12 16 14"></polygon></svg>
            Episode {{ currentEpisode }}
          </span>
        </div>
      </div>

      <div class="section-row mb-5">
        <div class="player-outer-glow">
          <div class="custom-video-ratio-box shadow-2xl">
            
            <div 
                v-if="!isPlayed" 
                class="absolute-overlay-layer play-ad-bg" 
                :style="overlayBackdropStyle"
                @click="handlePlayClick"
              >
                <div class="circle-play-pulse">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" class="play-triangle-icon">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <span class="text-pulse-ad"></span>
              </div>

            <iframe  
              v-if="isPlayed"
              :key="`player-${tvId}-${currentSeason}-${currentEpisode}`"
              :src="currentPlayerUrl" 
              allowfullscreen
              scrolling="no"
              allow="autoplay; encrypted-media"
              class="core-iframe-player">
            </iframe>
          </div>
        </div>
      </div>

      <div class="section-row">
        <div class="custom-modern-card">
          <div class="card-header-title-flex">
            <div class="neon-bar-indicator"></div>
            <h3 class="card-heading-text">Sponsored Content</h3>
          </div>
          
          <div class="adsterra-dashed-wrapper">
            <span class="adsterra-notice-tag">ADVERTISEMENT</span>
            <div class="adsterra-inject-box">
              <div id="container-dd5a3c4937ebe8b47da808bcd5e1d283"></div>
            </div>
          </div>
        </div>

        <div class="buffer-footer-info">
          <p>If the video is buffering, you can try switching servers inside the player or refresh the page.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()

const tvId = route.params.id
const tvSlug = route.params.slug || ''
const tmdbImgUrl = 'https://image.tmdb.org/t/p/original'

// Reactive State
const isPlayed = ref(false)
const activeServer = ref(route.query.server || 'vidsrc_me')

// Parsing awal dari slug
const parts = tvSlug.split('-')
const currentEpisode = ref(parseInt(route.query.e) || (parts.length >= 3 ? parseInt(parts[parts.length - 1]) : 1))
const currentSeason = ref(parseInt(route.query.s) || (parts.length >= 3 ? parseInt(parts[parts.length - 2]) : 1))

// Watch untuk update otomatis saat query URL berubah
watch(
  () => [route.query.s, route.query.e, route.query.server],
  ([newS, newE, newServer]) => {
    if (newS) currentSeason.value = parseInt(newS)
    if (newE) currentEpisode.value = parseInt(newE)
    if (newServer) activeServer.value = newServer
    isPlayed.value = false
  }
)

const { data: tvDetails } = await useFetch(`https://api.themoviedb.org/3/tv/${tvId}`, {
  query: { api_key: config.public.tmdbApiKey, language: 'en-US' }
})

const slugify = (text) => {
  if (!text) return ''
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

const detailsPageUrl = computed(() => {
  const titleSlug = tvDetails.value?.name ? slugify(tvDetails.value.name) : 'show'
  return `/tv/${tvId}/${titleSlug}-${currentSeason.value}-${currentEpisode.value}`
})

const currentPlayerUrl = computed(() => {
  const s = currentSeason.value
  const e = currentEpisode.value
  if (activeServer.value === 'vidsrc_cc') return `https://vidsrc.cc/v2/embed/tv/${tvId}/${s}/${e}`
  if (activeServer.value === 'vidsrc_to') return `https://vidsrc.to/embed/tv/${tvId}/${s}/${e}`
  return `https://vidsrc.me/embed/tv?tmdb=${tvId}&season=${s}&episode=${e}`
})

const backdropStyle = computed(() => {
  if (tvDetails.value?.backdrop_path) {
    return { backgroundImage: `linear-gradient(to bottom, rgba(8,9,12,0.7) 0%, #08090c 100%), url(${tmdbImgUrl}${tvDetails.value.backdrop_path})` }
  }
  return { backgroundColor: '#08090c' }
})

const overlayBackdropStyle = computed(() => {
  if (tvDetails.value?.backdrop_path) {
    return {
      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.75)), url(${tmdbImgUrl}${tvDetails.value.backdrop_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return { backgroundColor: 'rgba(0, 0, 0, 0.85)' } // Fallback jika gambar gagal dimuat
})

const handlePlayClick = () => {
  window.open('https://twigcrucialpal.com/qhexrkev?key=8f5d9e9efc0679706823f58257516b31', '_blank')
  setTimeout(() => { isPlayed.value = true }, 100)
}

onMounted(() => {
  const scripts = [
    { id: 'adsterra-new-widget', src: 'https://twigcrucialpal.com/dd5a3c4937ebe8b47da808bcd5e1d283/invoke.js' }
  ]
  
  scripts.forEach(item => {
    const old = document.getElementById(item.id)
    if (old) old.remove()
    const script = document.createElement('script')
    script.id = item.id
    script.src = item.src
    script.async = true
    document.head.appendChild(script)
  })
})
</script>

<style scoped>
/* (Style Anda tetap sama seperti sebelumnya) */
.watch-page-wrapper { background-color: #08090c; font-family: 'Inter', system-ui, -apple-system, sans-serif; overflow-x: hidden; position: relative; min-height: 100vh; width: 100%; }
.watch-container { width: 100%; max-width: 1140px; margin-right: auto; margin-left: auto; padding: 24px 16px; box-sizing: border-box; position: relative; z-index: 5; }
.space-top-safe { padding-top: 105px !important; }
@media (min-width: 768px) { .space-top-safe { padding-top: 90px !important; } }
.section-row { width: 100%; display: block; box-sizing: border-box; }
.mb-3 { margin-bottom: 1rem; } .mb-4 { margin-bottom: 1.5rem; } .mb-5 { margin-bottom: 3rem; }
.hero-blur-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 340px; background-size: cover; background-position: center top; filter: blur(60px); opacity: 0.2; z-index: 1; pointer-events: none; }
@media (min-width: 768px) { .hero-blur-backdrop { height: 550px; opacity: 0.3; } }
.btn-back-custom { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); color: #e5e5e5; padding: 8px 18px; font-size: 0.82rem; font-weight: 600; border-radius: 50px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s ease; backdrop-filter: blur(8px); }
.btn-back-custom:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(0, 242, 254, 0.4); color: #ffffff; }
.movie-main-title { color: #ffffff; font-weight: 800; margin: 0 0 10px 0; line-height: 1.2; letter-spacing: -0.5px; font-size: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
@media (min-width: 768px) { .movie-main-title { font-size: 2.25rem; } }
.meta-flex-group { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.badge-streaming { background: linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.4) 100%); color: #08090c; font-size: 0.62rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.5px; }
.meta-pill-item { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); font-weight: 500; }
.player-outer-glow { position: relative; width: 100%; }
.player-outer-glow::before { content: ''; position: absolute; top: 5%; left: 2%; width: 96%; height: 90%; background: rgba(0, 242, 254, 0.08); filter: blur(50px); z-index: -1; pointer-events: none; }
.custom-video-ratio-box { position: relative; width: 100%; padding-top: 56.25%; background: #000000; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; overflow: hidden; }
.core-iframe-player { position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important; border: none; z-index: 2; }
.absolute-overlay-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; padding: 16px; cursor: pointer; }
.play-ad-bg { background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); transition: background 0.25s ease; }
.play-ad-bg:hover { background: rgba(0, 0, 0, 0.62); }
.circle-play-pulse { width: 54px; height: 54px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.4) 100%); border-radius: 50%; color: #08090c; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; box-shadow: 0 0 20px rgba(0, 242, 254, 0.3); transition: transform 0.2s ease; }
.play-triangle-icon { margin-left: 3px; }
@media (min-width: 576px) { .circle-play-pulse { width: 70px; height: 70px; } }
.play-ad-bg:hover .circle-play-pulse { transform: scale(1.1); box-shadow: 0 0 30px rgba(0, 242, 254, 0.5); }
.text-pulse-ad { font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255, 255, 255, 0.9); }
@media (min-width: 576px) { .text-pulse-ad { font-size: 0.82rem; letter-spacing: 2px; } }
.custom-modern-card { background: rgba(13, 17, 23, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; box-sizing: border-box; }
@media (min-width: 768px) { .custom-modern-card { padding: 32px; } }
.card-header-title-flex { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.neon-bar-indicator { width: 4px; height: 18px; background: #00f2fe; border-radius: 4px; }
.card-heading-text { color: #f8f9fa; font-size: 1.05rem; font-weight: 700; margin: 0; }
.adsterra-dashed-wrapper { background: rgba(0, 0, 0, 0.2); border-radius: 8px; border: 1px dashed rgba(255, 255, 255, 0.1); padding: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 130px; box-sizing: border-box; }
.adsterra-notice-tag { font-size: 0.6rem; font-weight: 700; color: rgba(255, 255, 255, 0.2); letter-spacing: 2px; margin-bottom: 12px; }
.adsterra-inject-box { width: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
.buffer-footer-info { text-align: center; margin-top: 30px; color: rgba(255, 255, 255, 0.4); font-size: 0.78rem; padding: 0 10px; }
</style>