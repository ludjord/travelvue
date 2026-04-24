<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group">
        <div class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
          <span class="text-white text-lg">✈</span>
        </div>
        <span class="font-display font-bold text-xl" :class="scrolled ? 'text-navy' : 'text-white'">
          Travel<span class="text-gold-500">Vue</span>
        </span>
      </RouterLink>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
          class="font-medium transition-colors duration-200 hover:text-primary-500"
          :class="scrolled ? 'text-gray-700' : 'text-white/90'">
          {{ link.label }}
        </RouterLink>
      </div>

      <!-- Auth Buttons -->
      <div class="hidden md:flex items-center gap-3">
        <template v-if="auth.isLoggedIn">
          <div class="relative" ref="dropdownRef">
            <button @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-primary-50"
              :class="scrolled ? 'text-gray-700' : 'text-white'">
              <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                {{ auth.user?.name?.charAt(0) }}
              </div>
              <span class="text-sm font-medium">{{ auth.user?.name?.split(' ')[0] }}</span>
              <span class="text-xs">▾</span>
            </button>
            <div v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-semibold text-gray-800">{{ auth.user?.name }}</p>
                <p class="text-xs text-gray-400">{{ auth.user?.email }}</p>
              </div>
              <RouterLink to="/my-bookings" @click="dropdownOpen = false"
                class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                📋 Booking Saya
              </RouterLink>
              <RouterLink v-if="auth.isAdmin" to="/admin" @click="dropdownOpen = false"
                class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                ⚙️ Admin Panel
              </RouterLink>
              <button @click="handleLogout"
                class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                🚪 Keluar
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login"
            class="font-medium text-sm transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-white/10"
            :class="scrolled ? 'text-gray-700 hover:text-primary-500' : 'text-white'">
            Masuk
          </RouterLink>
          <RouterLink to="/register" class="btn-primary text-sm !py-2 !px-5">
            Daftar
          </RouterLink>
        </template>
      </div>

      <!-- Mobile hamburger -->
      <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-xl"
        :class="scrolled ? 'text-gray-700' : 'text-white'">
        <div class="w-6 h-5 flex flex-col justify-between">
          <span class="h-0.5 bg-current rounded transition-all" :class="mobileOpen ? 'rotate-45 translate-y-2' : ''"></span>
          <span class="h-0.5 bg-current rounded transition-all" :class="mobileOpen ? 'opacity-0' : ''"></span>
          <span class="h-0.5 bg-current rounded transition-all" :class="mobileOpen ? '-rotate-45 -translate-y-2' : ''"></span>
        </div>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileOpen" class="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 animate-fade-in">
      <div class="px-4 py-4 space-y-1">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" @click="mobileOpen = false"
          class="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors">
          {{ link.label }}
        </RouterLink>
        <div class="border-t border-gray-100 pt-3 mt-3 flex flex-col gap-2">
          <template v-if="auth.isLoggedIn">
            <RouterLink to="/my-bookings" @click="mobileOpen = false"
              class="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 font-medium">
              📋 Booking Saya
            </RouterLink>
            <RouterLink v-if="auth.isAdmin" to="/admin" @click="mobileOpen = false"
              class="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 font-medium">
              ⚙️ Admin Panel
            </RouterLink>
            <button @click="handleLogout" class="btn-primary w-full text-center">Keluar</button>
          </template>
          <template v-else>
            <RouterLink to="/login" @click="mobileOpen = false" class="btn-secondary text-center">Masuk</RouterLink>
            <RouterLink to="/register" @click="mobileOpen = false" class="btn-primary text-center">Daftar</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const router = useRouter()
const scrolled = ref(false)
const dropdownOpen = ref(false)
const mobileOpen = ref(false)
const dropdownRef = ref(null)

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/destinations', label: 'Destinasi' },
  { to: '/packages', label: 'Paket Wisata' },
]

function handleScroll() { scrolled.value = window.scrollY > 20 }
function handleClickOutside(e) { if (dropdownRef.value && !dropdownRef.value.contains(e.target)) dropdownOpen.value = false }

function handleLogout() {
  auth.logout()
  dropdownOpen.value = false
  mobileOpen.value = false
  router.push('/')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>
