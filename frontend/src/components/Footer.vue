<template>
  <footer class="bg-navy text-white">
    <!-- Main Footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span class="text-white text-xl">✈</span>
            </div>
            <span class="font-display font-bold text-2xl">Travel<span class="text-gold-500">Vue</span></span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">
            Temukan petualangan tak terlupakan bersama kami. Kami hadirkan pengalaman wisata terbaik di seluruh nusantara.
          </p>
          <div class="flex items-center gap-3 mt-6">
            <a v-for="social in socials" :key="social.label" href="#"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary-500 flex items-center justify-center text-sm transition-all duration-300 hover:scale-110">
              {{ social.icon }}
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-semibold text-white mb-5">Tautan Cepat</h3>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.to">
              <RouterLink :to="link.to" class="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center gap-2">
                <span class="text-primary-500">→</span> {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Destinations -->
        <div>
          <h3 class="font-semibold text-white mb-5">Destinasi Populer</h3>
          <ul class="space-y-3">
            <li v-for="dest in popularDests" :key="dest">
              <span class="text-gray-400 text-sm flex items-center gap-2">
                <span class="text-gold-500">📍</span> {{ dest }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="font-semibold text-white mb-5">Hubungi Kami</h3>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-gray-400 text-sm">
              <span class="mt-0.5">📍</span>
              <span>Jl. Wisata Nusantara No. 99,<br>Jakarta Selatan, 12345</span>
            </li>
            <li class="flex items-center gap-3 text-gray-400 text-sm">
              <span>📞</span> +62 812-3456-7890
            </li>
            <li class="flex items-center gap-3 text-gray-400 text-sm">
              <span>✉️</span> info@travelvue.id
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p class="text-gray-500 text-sm">© {{ new Date().getFullYear() }} TravelVue. Semua hak dilindungi.</p>
        <div class="flex items-center gap-1 text-sm text-gray-500">
          Dibuat dengan <span class="text-coral mx-1">❤</span> untuk para penjelajah Indonesia
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const socials = [
  { icon: '📘', label: 'Facebook' },
  { icon: '📸', label: 'Instagram' },
  { icon: '🐦', label: 'Twitter' },
  { icon: '▶️', label: 'YouTube' },
]

const quickLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/destinations', label: 'Destinasi' },
  { to: '/packages', label: 'Paket Wisata' },
  { to: '/login', label: 'Masuk' },
  { to: '/register', label: 'Daftar' },
]

const popularDests = ['Raja Ampat', 'Bali', 'Labuan Bajo', 'Yogyakarta', 'Lombok']
</script>
