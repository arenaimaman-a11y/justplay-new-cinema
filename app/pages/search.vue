<template>
  <div class="bg-gray-950 min-h-screen text-gray-200 antialiased pt-32 pb-16">
    <div class="container mx-auto px-4 md:px-8 max-w-5xl">
      
      <div class="border-b border-white/[0.04] pb-4 mb-8">
        <h1 class="text-xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <span class="w-1 h-5 md:w-1.5 md:h-7 bg-red-600 rounded-full"></span>
          Search Results for: <span class="text-red-500">"{{ queryParam }}"</span>
        </h1>
        <p class="text-xs text-gray-500 mt-1">Found {{ totalResults }} matches across movies and TV shows</p>
      </div>

      <div v-if="pending" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>

      <div v-else-if="!resultsList || resultsList.length === 0" class="text-center py-20 bg-gray-900/20 border border-dashed border-white/[0.05] rounded-2xl">
        <span class="text-4xl block mb-3">🔍</span>
        <h2 class="text-lg font-bold text-gray-300">No results found</h2>
        <p class="text-xs text-gray-500 max-w-xs mx-auto mt-1">We couldn't find any movies or TV shows matching your keyword. Try checking your spelling.</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        <NuxtLink 
          v-for="item in resultsList" 
          :key="item.id" 
          :to="`/${item.media_type || 'movie'}/${item.id}/${slugify(item.title || item.name)}-${item.id}`" 
          class="group relative bg-gray-900/10 border border-white/[0.04] rounded-xl overflow-hidden hover:border-red-600/40 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl"
        >
          <div class="relative aspect-[2/3] overflow-hidden bg-gray-950">
            <img 
              v-if="item.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
              :alt="item.title || item.name" 
              loading="lazy"
            >
            <div v-else class="w-full h-full bg-gray-900 flex items-center justify-center text-center p-4 text-[10px] text-gray-600">
              No Image Available
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-90 group-hover:via-gray-950/30 transition-all"></div>
            
            <div v-if="item.vote_average" class="absolute top-2 right-2 bg-gray-950/80 backdrop-blur-md text-yellow-500 font-bold text-[9px] md:text-xs px-1.5 py-0.5 rounded border border-gray-800 flex items-center gap-0.5 shadow">
              ⭐ {{ item.vote_average.toFixed(1) }}
            </div>
          </div>

          <div class="p-2.5 md:p-3.5">
            <span class="text-[9px] uppercase tracking-wider font-bold text-red-500 block mb-0.5">
              {{ item.media_type === 'tv' ? 'TV Show' : 'Movie' }}
            </span>
            <h3 class="font-bold text-xs md:text-sm tracking-tight line-clamp-1 text-gray-200 group-hover:text-red-500 transition-colors">
              {{ item.title || item.name }}
            </h3>
            <span class="text-[10px] font-medium text-gray-500 mt-0.5 block">
              {{ (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A' }}
            </span>
          </div>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()

const queryParam = computed(() => route.query.q || '')

const { data: searchData, pending } = await useFetch('https://api.themoviedb.org/3/search/multi', {
  watch: [queryParam],
  query: {
    api_key: config.public.tmdbApiKey,
    query: queryParam,
    language: 'en-US',
    include_adult: false
  }
})

const resultsList = computed(() => {
  return searchData.value?.results?.filter(item => item.media_type === 'movie' || item.media_type === 'tv') || []
})

const totalResults = computed(() => resultsList.value.length)

const slugify = (text) => {
  if (!text) return ''
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
}

useHead({
  title: `Search results for "${queryParam.value}" - JustPlay`,
  meta: [
    { name: 'robots', content: 'noindex, follow' }
  ]
})
</script>