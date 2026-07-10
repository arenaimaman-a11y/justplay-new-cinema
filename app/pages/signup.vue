<template>
  <main class="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-red-600/5 blur-[140px] pointer-events-none rounded-full"></div>

    <div class="w-full max-w-md bg-gray-900/40 backdrop-blur-md border border-white/[0.04] p-8 rounded-2xl shadow-2xl relative z-10">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-black text-white tracking-tight">Create Account</h2>
        <p class="text-xs text-gray-500 mt-1">Join us to get latest episode notifications</p>
      </div>

      <form @submit.prevent="handleSignup" class="flex flex-col gap-4">
        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
          <input v-model="email" type="email" placeholder="name@example.com" class="w-full bg-gray-950 border border-white/5 focus:border-red-600 p-3.5 rounded-xl text-xs text-white outline-none transition-colors" required />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
          <input v-model="password" type="password" placeholder="••••••••" class="w-full bg-gray-950 border border-white/5 focus:border-red-600 p-3.5 rounded-xl text-xs text-white outline-none transition-colors" required />
        </div>

        <p v-if="message" :class="['text-xs font-semibold mt-1', isError ? 'text-red-500' : 'text-green-500']">{{ message }}</p>

        <button :disabled="loading" type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-[0_4px_20px_rgba(220,38,38,0.25)] active:scale-[0.98] disabled:opacity-50">
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="text-center mt-6 pt-5 border-t border-white/[0.04]">
        <p class="text-xs text-gray-500">Already have an account? <NuxtLink to="/login" class="text-red-500 hover:underline font-bold">Sign In</NuxtLink></p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const handleSignup = async () => {
  loading.value = true
  message.value = ''
  isError.value = false

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (error) {
    isError.value = true
    message.value = error.message
    loading.value = false
  } else {
    message.value = 'Registration success! Redirecting to home...'
    
    // Reset form field
    email.value = ''
    password.value = ''
    loading.value = false

    // Jeda 2 detik agar user sempat membaca teks sukses sebelum dilempar ke beranda
    setTimeout(() => {
      navigateTo('/?signup=success')
    }, 2000)
  }
}
</script>