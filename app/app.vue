<template>
  <div class="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased selection:bg-red-600 selection:text-white relative">
    
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

          <div class="flex items-center gap-3 sm:w-auto justify-end min-w-0">
            <form @submit.prevent="executeSearch" :class="['relative flex items-center rounded-full border transition-all duration-500 w-44 sm:w-56 md:w-60', isScrolled ? 'bg-gray-900/60 border-white/[0.05] focus-within:border-red-600/50' : 'bg-black/40 border-white/10 backdrop-blur-md focus-within:border-red-600/50']">
              <input v-model="searchQuery" type="text" placeholder="Search..." class="w-full bg-transparent text-xs pl-4 pr-9 py-2.5 md:py-3 rounded-full text-gray-200 placeholder-gray-500 focus:outline-none font-medium" />
              <button type="submit" class="absolute right-2.5 p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Submit Search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
                </svg>
              </button>
            </form>

            <div v-if="currentUser" class="relative group shrink-0">
              <div class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 cursor-pointer border border-white/10 select-none">
                {{ userInitial }}
              </div>
              
              <div class="absolute right-0 mt-2 w-44 bg-gray-900 border border-white/[0.06] rounded-xl shadow-2xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[9999]">
                <div class="px-3 py-1.5 border-b border-white/[0.04]">
                  <p class="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Signed in as</p>
                  <p class="text-[10px] text-gray-300 truncate font-semibold">{{ currentUser.email }}</p>
                </div>
                <button @click="handleLogout" class="w-full text-left px-3 py-2 text-[11px] text-red-400 hover:bg-white/[0.02] font-bold transition-colors">
                  Sign Out
                </button>
              </div>
            </div>

            <div v-else class="relative group shrink-0">
              <NuxtLink to="/signup" class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-900 hover:bg-gray-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors shadow-lg cursor-pointer select-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 md:w-5 md:h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </NuxtLink>

              <div class="absolute right-0 mt-2 w-36 bg-gray-900 border border-white/[0.06] rounded-xl shadow-2xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[9999]">
                <NuxtLink to="/signup" class="block w-full text-left px-3 py-2 text-[11px] text-gray-300 hover:bg-white/[0.02] font-bold transition-colors">
                  Sign Up
                </NuxtLink>
                <NuxtLink to="/login" class="block w-full text-left px-3 py-2 text-[11px] text-gray-400 hover:bg-white/[0.02] font-bold border-t border-white/[0.04] transition-colors">
                  Sign In
                </NuxtLink>
              </div>
            </div>

          </div>

        </div>
      </div>
    </nav>

    <div class="w-full">
      <NuxtPage />
    </div>
    
    <!-- Success Bar -->
    <div 
      class="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-85 bg-gray-950 border border-green-500 p-4 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.3)] flex gap-3 items-start transition-all duration-500 ease-in-out"
      :class="isSuccessBarOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-95 pointer-events-none'"
      style="z-index: 999999 !important; position: fixed !important; display: flex !important;"
    >
      <div class="p-2 bg-green-600/20 border border-green-500 text-green-500 rounded-lg shrink-0">
        <svg class="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="text-xs font-black text-white tracking-wide">🎉 REGISTRATION SUCCESS!</h4>
        <p class="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
          Account created. Enjoy your no-ads access.
        </p>
      </div>
      <button @click="isSuccessBarOpen = false" class="text-gray-400 hover:text-gray-200 transition-colors shrink-0">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useAds } from '../composables/useAds'

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const searchQuery = ref('')
const { triggerAdsterra } = useAds()

// Ref lokal untuk status user
const currentUser = ref(null)

const userInitial = computed(() => {
  if (currentUser.value && currentUser.value.email) {
    return currentUser.value.email.charAt(0)
  }
  return 'U'
})

// State Pengendali Bar Notifikasi
const isSuccessBarOpen = ref(false)

const handleLogout = () => {
  currentUser.value = null
  router.push('/')
}

// Tracking Histats
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

watch(() => route.fullPath, () => {
  setTimeout(() => {
    if (typeof window !== 'undefined' && window._Hasync) {
      window._Hasync.push(['Histats.track_hits', '']);
    }
  }, 800)
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

  if (route.query.signup === 'success') {
    isSuccessBarOpen.value = true
    router.replace({ query: null })

    setTimeout(() => {
      isSuccessBarOpen.value = false
    }, 7000)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>