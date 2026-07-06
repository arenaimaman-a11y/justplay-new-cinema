<template>
  <div class="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased selection:bg-red-600 selection:text-white">
    
    <nav 
      :class="[
        'fixed top-0 z-50 w-full transition-all duration-500 ease-in-out',
        isScrolled 
          ? 'backdrop-blur-xl bg-gray-950/90 border-b border-white/[0.04] shadow-2xl py-3' 
          : 'bg-transparent border-b border-transparent py-5'
      ]"
    >
      <div class="container mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center px-4 md:px-8 max-w-6xl">
        
        <NuxtLink to="/" class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 tracking-tighter hover:opacity-90 transition-opacity">
          JustPlay
        </NuxtLink>
        
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div 
            :class="[
              'flex gap-1 p-1 rounded-full border transition-all duration-500 flex-shrink-0',
              isScrolled ? 'bg-gray-900/40 border-white/[0.05]' : 'bg-black/30 border-white/10 backdrop-blur-md'
            ]"
          >
            <NuxtLink to="/movie" class="px-3.5 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold rounded-full text-gray-300 hover:text-white transition-all duration-200" active-class="bg-red-600 text-white shadow-lg shadow-red-600/20">Movies</NuxtLink>
            <NuxtLink to="/tv" class="px-3.5 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold rounded-full text-gray-300 hover:text-white transition-all duration-200" active-class="bg-red-600 text-white shadow-lg shadow-red-600/20">TV Shows</NuxtLink>
          </div>

          <form @submit.prevent="executeSearch" :class="['relative flex items-center rounded-full border transition-all duration-500 max-w-[200px] md:max-w-[240px] w-full', isScrolled ? 'bg-gray-900/60 border-white/[0.05] focus-within:border-red-600/50' : 'bg-black/40 border-white/10 backdrop-blur-md focus-within:border-red-600/50']">
            <input v-model="searchQuery" type="text" placeholder="Search movie or TV..." class="w-full bg-transparent text-xs pl-4 pr-9 py-2.5 md:py-3 rounded-full text-gray-200 placeholder-gray-500 focus:outline-none font-medium" />
            <button type="submit" class="absolute right-2.5 p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Submit Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>

    <div class="w-full">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { useAds } from '../composables/useAds'

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const searchQuery = ref('')
const { triggerAdsterra } = useAds()

// Inisialisasi Histats & Tracking
useHead({
  script: [
    {
      innerHTML: `
        var _Hasync= _Hasync|| [];
        _Hasync.push(['Histats.start', '1,4987856,4,0,0,0,00010000']);
        _Hasync.push(['Histats.fasi', '1']);
        _Hasync.push(['Histats.track_hits', '']);
        (function() {
          var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
          hs.src = ('//s10.histats.com/js15_as.js');
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
        })();
      `,
      type: 'text/javascript'
    }
  ],
  noscript: [
    {
      innerHTML: `<a href="/" target="_blank"><img src="//sstatic1.histats.com/0.gif?4987856&101" alt="site hit counter" border="0"></a>`
    }
  ]
})

// Fungsi untuk memaksa Histats menangkap perubahan halaman (Judul Baru)
watch(() => route.fullPath, () => {
  setTimeout(() => {
    if (typeof window !== 'undefined' && window._Hasync) {
      window._Hasync.push(['Histats.track_hits', '']);
    }
  }, 800) // Delay 800ms agar document.title sudah terupdate oleh Nuxt
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const executeSearch = () => {
  if (!searchQuery.value.trim()) return
  triggerAdsterra()
  router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  searchQuery.value = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>