<template>
  <div class="bg-gray-950 min-h-screen text-gray-100 pt-32 pb-16">
    <div class="container mx-auto px-4 md:px-8 max-w-5xl">
      <h1 class="text-3xl font-black text-white mb-8 border-l-4 border-red-600 pl-4">Popular TV Shows</h1>
      
      <div v-if="pending" class="text-center py-20">Loading...</div>
      
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <NuxtLink 
          v-for="item in tvShows?.results" 
          :key="item.id" 
          :to="`/tv/${item.id}/${slugify(item.name)}-${item.id}`"
          class="group bg-gray-900 rounded-xl overflow-hidden hover:ring-2 ring-red-600 transition-all"
        >
          <img :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" class="w-full aspect-[2/3] object-cover" loading="lazy">
          <div class="p-3">
            <h3 class="text-sm font-bold truncate">{{ item.name }}</h3>
            <p class="text-[10px] text-gray-400">{{ item.first_air_date?.split('-')[0] }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { data: tvShows, pending } = await useFetch('https://api.themoviedb.org/3/tv/popular', {
  query: { api_key: config.public.tmdbApiKey }
})

const slugify = (text) => text?.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') || ''
</script>