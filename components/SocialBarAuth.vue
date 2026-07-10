<template>
  <!-- Kita buang tag <Transition> dan ganti dengan transisi class Tailwind murni -->
  <div 
    class="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-80 bg-gray-950 border border-red-500 p-4 rounded-xl shadow-[0_0_40px_rgba(220,38,38,0.4)] flex gap-3 items-start transition-all duration-500 ease-out"
    :class="isOpen ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'"
    style="z-index: 999999 !important; position: fixed !important;"
  >
    <!-- Icon Bell -->
    <div class="p-2 bg-red-600/20 border border-red-500 text-red-500 rounded-lg shrink-0 animate-bounce">
      <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <h4 class="text-xs font-black text-white tracking-wide">⚡ NO ADS & FAST UPDATE</h4>
      <p class="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
        Sign up now to unblock <span class="text-red-400 font-bold">No-Ads Player</span> and receive instant new episode notifications!
      </p>
      
      <div class="flex items-center gap-2 mt-3">
        <NuxtLink 
          to="/signup" 
          class="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all shadow-md shadow-red-600/30"
        >
          Sign Up Free
        </NuxtLink>
        <NuxtLink 
          to="/login" 
          class="text-gray-400 hover:text-white font-bold text-[10px] px-2 py-1.5"
        >
          Sign In
        </NuxtLink>
      </div>
    </div>

    <!-- Button Close -->
    <button 
      @click="closeBar" 
      class="text-gray-400 hover:text-gray-200 transition-colors shrink-0"
    >
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = useSupabaseUser()
const isOpen = ref(false)

const closeBar = () => {
  isOpen.value = false
  localStorage.setItem('hide_auth_bar', 'true')
}

onMounted(() => {
  setTimeout(() => {
    const isHidden = localStorage.getItem('hide_auth_bar')
    
    // Selama pengetesan ini, kita bypass dulu deteksi user Supabase
    // tujuannya agar kita benar-benar melihat bendanya muncul di layar
    if (!isHidden) {
      isOpen.value = true
    }
  }, 1500) // Muncul cepat dalam 1.5 detik
})
</script>