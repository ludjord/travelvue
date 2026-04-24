<template>
  <div class="min-h-screen bg-gradient-to-br from-navy via-primary-900 to-primary-700 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2">
          <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <span class="text-2xl">✈</span>
          </div>
          <span class="font-display font-bold text-2xl text-white">Travel<span class="text-gold-400">Vue</span></span>
        </RouterLink>
        <h1 class="font-display text-3xl font-bold text-white mt-6 mb-2">Buat Akun</h1>
        <p class="text-white/60">Bergabung dan mulai petualangan Anda</p>
      </div>

      <div class="glass rounded-2xl p-8">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Nama Lengkap</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="Nama Anda" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input v-model="form.email" type="email" class="input-field" placeholder="email@contoh.com" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Nomor HP</label>
            <input v-model="form.phone" type="tel" class="input-field" placeholder="08xx-xxxx-xxxx" />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" class="input-field pr-12"
                placeholder="Min. 6 karakter" required minlength="6" />
              <button type="button" @click="showPw = !showPw"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div v-if="error" class="bg-red-500/10 border border-red-400/30 text-red-300 text-sm px-4 py-3 rounded-xl">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full text-base !py-4 mt-2" :disabled="loading">
            <span v-if="loading">⏳ Mendaftar...</span>
            <span v-else>Buat Akun →</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-white/50 text-sm">
            Sudah punya akun?
            <RouterLink to="/login" class="text-gold-400 font-semibold hover:text-gold-300 ml-1">Masuk sekarang</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()
const form = ref({ name: '', email: '', phone: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPw = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Pendaftaran gagal, coba lagi'
  } finally { loading.value = false }
}
</script>
