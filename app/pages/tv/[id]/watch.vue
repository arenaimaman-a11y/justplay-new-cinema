<template>
  <div class="watch-page-wrapper text-white">
    <div class="hero-blur-backdrop" :style="backdropStyle"></div>
    <div class="watch-container space-top-safe">
      
      <!-- Button Back -->
      <div class="section-row mb-3">
        <button @click="$router.push(detailsPageUrl)" class="btn-back-custom">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Details
        </button>
      </div>

      <!-- Title & Meta -->
      <div class="section-row mb-4">
        <h1 class="movie-main-title">{{ tvDetails?.name || 'Loading Video...' }}</h1>
        <div class="meta-flex-group">
          <span class="badge-streaming">NOW STREAMING</span>
          <span class="meta-pill-item">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            Season {{ currentSeason }}
          </span>
          <span class="meta-pill-item">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polygon points="12 6 12 16 14"></polygon></svg>
            Episode {{ currentEpisode }}
          </span>
        </div>
      </div>

      <!-- Player Section -->
      <div class="section-row mb-5">
        <div class="player-outer-glow">
          <div class="custom-video-ratio-box shadow-2xl">
            
            <ClientOnly>
              <!-- 1. OVERLAY PLAYER (Sebelum Play Di-klik) -->
              <div 
                v-if="!isPlayPressed" 
                @click="handleFakePlay"
                class="fake-player-overlay"
                :style="backdropStyle"
              >
                <!-- Play Button Center Icon -->
                <div class="play-button-trigger">
                  <svg viewBox="0 0 24 24" class="play-svg-icon" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <!-- Mini Info Banner -->
                <div class="fake-player-banner">
                  <span>PLAY - Season {{ currentSeason }} Ep {{ currentEpisode }}</span>
                </div>
              </div>

              <!-- 2. MAIN MOVIE IFRAME PLAYER (Aktif Setelah Klik Pertama) -->
              <iframe  
                v-else
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

      <!-- Area Bawah Player -->
      <div class="section-row">
        <div class="custom-modern-card">
          <div class="card-header-title-flex">
            <div class="neon-bar-indicator"></div>
            <h3 class="card-heading-text">Streaming Information</h3>
          </div>
          
          <div class="streaming-info-content">
            <p class="info-text-main">
              You are currently watching <strong>{{ tvDetails?.name }}</strong> Season {{ currentSeason }} Episode {{ currentEpisode }}.
            </p>
            <p class="info-text-sub">
              If the current server is slow or buffering, please switch alternative servers provided inside the video player menu or reload your browser window.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()
const tvId = route.params.id
const tvSlug = route.params.slug || ''
const tmdbImgUrl = 'https://image.tmdb.org/t/p/original'

const parts = tvSlug.split('-')
const currentEpisode = ref(parseInt(route.query.e) || (parts.length >= 3 ? parseInt(parts[parts.length - 1]) : 1))
const currentSeason = ref(parseInt(route.query.s) || (parts.length >= 3 ? parseInt(parts[parts.length - 2]) : 1))
const activeServer = ref(route.query.server || 'vidsrc_me')

// State untuk memantau apakah player overlay sudah di-klik
const isPlayPressed = ref(false)

// Reset overlay jika user mengganti episode lewat parameter rute
watch(
  () => [route.query.s, route.query.e, route.query.server],
  ([newS, newE, newServer]) => {
    if (newS) currentSeason.value = parseInt(newS)
    if (newE) currentEpisode.value = parseInt(newE)
    if (newServer) activeServer.value = newServer
    isPlayPressed.value = false // Tampilkan kembali Overlay Player untuk episode baru
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
  const suffix = "?autoplay=1" 
  if (activeServer.value === 'vidsrc_cc') return `https://vidsrc.cc/v2/embed/tv/${tvId}/${s}/${e}${suffix}`
  if (activeServer.value === 'vidsrc_to') return `https://vidsrc.to/embed/tv/${tvId}/${s}/${e}${suffix}`
  return `https://vidsrc.me/embed/tv?tmdb=${tvId}&season=${s}&episode=${e}&autoplay=1`
})

const backdropStyle = computed(() => {
  if (tvDetails.value?.backdrop_path) {
    return { backgroundImage: `linear-gradient(to bottom, rgba(8,9,12,0.65) 0%, #08090c 100%), url(${tmdbImgUrl}${tvDetails.value.backdrop_path})` }
  }
  return { backgroundColor: '#08090c' }
})

// Membuka video player asli secara langsung tanpa pemicu iklan
const handleFakePlay = () => {
  isPlayPressed.value = true
}
</script>

<style scoped>
/* PLAYER OVERLAY STYLING */
.fake-player-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
}

.fake-player-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  transition: background 0.3s ease;
}

.fake-player-overlay:hover::after {
  background: rgba(0, 0, 0, 0.25);
}

.play-button-trigger {
  width: 76px;
  height: 76px;
  background: #ef4444; /* Warna Merah khas tema */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
  z-index: 25;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fake-player-overlay:hover .play-button-trigger {
  transform: scale(1.12);
  background: #f87171;
  box-shadow: 0 0 45px rgba(239, 68, 68, 0.8);
}

.play-svg-icon {
  width: 28px;
  height: 28px;
  color: #ffffff;
  margin-left: 4px; /* Align visual offset segitiga */
}

.fake-player-banner {
  margin-top: 18px;
  background: rgba(8, 9, 12, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #e5e5e5;
  z-index: 25;
  backdrop-filter: blur(4px);
}

/* KODE STYLE ASLI */
.custom-video-ratio-box { position: relative; width: 100%; padding-top: 56.25%; background: #000000; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; overflow: hidden; }
.custom-modern-card { background: rgba(13, 17, 23, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; box-sizing: border-box; }
.card-header-title-flex { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.neon-bar-indicator { width: 4px; height: 18px; background: #ef4444; border-radius: 4px; }
.card-heading-text { color: #f8f9fa; font-size: 1.05rem; font-weight: 700; margin: 0; }
.streaming-info-content { display: flex; flex-direction: column; gap: 8px; }
.info-text-main { font-size: 0.95rem; color: rgba(255, 255, 255, 0.85); margin: 0; line-height: 1.5; }
.info-text-main strong { color: #ef4444; }
.info-text-sub { font-size: 0.82rem; color: rgba(255, 255, 255, 0.45); margin: 0; line-height: 1.6; }
.watch-page-wrapper { background-color: #08090c; font-family: 'Inter', system-ui, -apple-system, sans-serif; overflow-x: hidden; position: relative; min-height: 100vh; width: 100%; }
.watch-container { width: 100%; max-width: 1140px; margin-right: auto; margin-left: auto; padding: 24px 16px; box-sizing: border-box; position: relative; z-index: 5; }
.space-top-safe { padding-top: 105px !important; }
@media (min-width: 768px) { .space-top-safe { padding-top: 90px !important; } }
.section-row { width: 100%; display: block; box-sizing: border-box; }
.mb-3 { margin-bottom: 1rem; } .mb-4 { margin-bottom: 1.5rem; } .mb-5 { margin-bottom: 3rem; }
.hero-blur-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 340px; background-size: cover; background-position: center top; filter: blur(60px); opacity: 0.2; z-index: 1; pointer-events: none; }
@media (min-width: 768px) { .hero-blur-backdrop { height: 550px; opacity: 0.3; } }
.btn-back-custom { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); color: #e5e5e5; padding: 8px 18px; font-size: 0.82rem; font-weight: 600; border-radius: 50px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s ease; backdrop-filter: blur(8px); }
.btn-back-custom:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(239, 68, 68, 0.4); color: #ffffff; }
.movie-main-title { color: #ffffff; font-weight: 800; margin: 0 0 10px 0; line-height: 1.2; letter-spacing: -0.5px; font-size: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
@media (min-width: 768px) { .movie-main-title { font-size: 2.25rem; } }
.meta-flex-group { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.badge-streaming { background: linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(185, 28, 28, 1) 100%); color: #ffffff; font-size: 0.62rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; letter-spacing: 0.5px; }
.meta-pill-item { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); font-weight: 500; }
.player-outer-glow { position: relative; width: 100%; }
.player-outer-glow::before { content: ''; position: absolute; top: 5%; left: 2%; width: 96%; height: 90%; background: rgba(239, 68, 68, 0.08); filter: blur(50px); z-index: -1; pointer-events: none; }
.core-iframe-player { position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important; border: none; z-index: 2; }
</style>