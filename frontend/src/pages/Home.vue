<template>
  <div>
    <!-- Hero Section -->
    <section class="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-primary-900 to-primary-700">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-96 h-96 bg-primary-500/15 rounded-full -top-20 -right-20 blur-3xl animate-float"></div>
        <div class="absolute w-80 h-80 bg-gold-500/8 rounded-full bottom-20 -left-10 blur-3xl animate-float animation-delay-400"></div>
        <div class="absolute w-64 h-64 bg-primary-400/20 rounded-full top-1/2 right-1/4 blur-3xl animate-float animation-delay-200"></div>
      </div>


      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm mb-6 animate-fade-in">
          <span class="text-gold-400">✨</span> Temukan Keajaiban Nusantara Bersama Kami
        </div>

        <h1 class="font-display text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up text-shadow">
          Jelajahi Dunia<br>
          <span class="text-gold-400">Dengan Cara Anda</span>
        </h1>

        <p class="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-slide-up animation-delay-200">
          Ratusan destinasi eksotis, paket wisata terbaik, dan pengalaman tak terlupakan menanti Anda. Mulai petualangan Anda sekarang!
        </p>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto animate-slide-up animation-delay-400">
          <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
            <div class="flex-1 flex items-center gap-3 px-4">
              <span class="text-gray-400 text-xl">🔍</span>
              <input v-model="searchQuery" type="text" placeholder="Mau ke mana?"
                class="flex-1 outline-none text-gray-800 placeholder-gray-400 py-2 text-base"
                @keyup.enter="goSearch" />
            </div>
            <button @click="goSearch" class="btn-primary whitespace-nowrap">
              Cari Destinasi
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-14 animate-slide-up animation-delay-600">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="font-display text-3xl font-bold text-white">{{ stat.value }}</div>
            <div class="text-white/60 text-sm mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-float">
        <div class="flex flex-col items-center gap-1 text-xs">
          <span>Scroll</span>
          <span class="text-lg">↓</span>
        </div>
      </div>
    </section>

    <!-- Featured Destinations -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <p class="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-2">Jelajahi</p>
        <h2 class="section-title">Destinasi Pilihan</h2>
        <p class="section-subtitle mx-auto text-center">Destinasi-destinasi terpopuler yang wajib masuk dalam bucket list perjalanan Anda</p>
      </div>
      <div v-if="loadingDest" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="card animate-pulse">
          <div class="aspect-[4/3] bg-gray-200 rounded-t-2xl"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DestinationCard v-for="dest in featuredDests" :key="dest.id" :dest="dest" />
      </div>
      <div class="text-center mt-10">
        <RouterLink to="/destinations" class="btn-secondary inline-block">
          Lihat Semua Destinasi →
        </RouterLink>
      </div>
    </section>

    <!-- Why Us -->
    <section class="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-2">Keunggulan Kami</p>
          <h2 class="section-title">Kenapa Pilih TravelVue?</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="feat in features" :key="feat.title"
            class="bg-white rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div class="text-4xl mb-4">{{ feat.icon }}</div>
            <h3 class="font-bold text-gray-900 mb-2">{{ feat.title }}</h3>
            <p class="text-gray-500 text-sm">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Packages -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <p class="text-primary-500 font-semibold text-sm uppercase tracking-widest mb-2">Penawaran Terbaik</p>
        <h2 class="section-title">Paket Wisata Populer</h2>
        <p class="section-subtitle mx-auto text-center">Paket wisata all-inclusive terbaik dengan harga terjangkau dan pelayanan premium</p>
      </div>
      <div v-if="loadingPkg" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="card animate-pulse">
          <div class="aspect-video bg-gray-200 rounded-t-2xl"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-gray-200 rounded w-4/5"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
            <div class="h-3 bg-gray-100 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PackageCard v-for="pkg in featuredPkgs" :key="pkg.id" :pkg="pkg" />
      </div>
      <div class="text-center mt-10">
        <RouterLink to="/packages" class="btn-secondary inline-block">
          Lihat Semua Paket →
        </RouterLink>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-navy">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-2">Testimoni</p>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-white">Apa Kata Mereka?</h2>
          <p class="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">Ribuan traveler telah mempercayakan perjalanan mereka kepada TravelVue</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard v-for="t in testimonials" :key="t.id" :testimonial="t" />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-500 to-primary-700 relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute w-96 h-96 bg-white/5 rounded-full -top-20 -right-20 blur-3xl"></div>
        <div class="absolute w-64 h-64 bg-white/5 rounded-full bottom-0 left-10 blur-3xl"></div>
      </div>
      <div class="relative max-w-3xl mx-auto text-center px-4">
        <h2 class="font-display text-4xl font-bold text-white mb-4">Siap Memulai Petualangan?</h2>
        <p class="text-white/80 text-lg mb-8">Daftar sekarang dan dapatkan penawaran eksklusif untuk perjalanan pertama Anda!</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/register" class="bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:-translate-y-0.5">
            Mulai Sekarang
          </RouterLink>
          <RouterLink to="/packages" class="btn-gold">Lihat Paket Wisata</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import DestinationCard from '../components/DestinationCard.vue'
import PackageCard from '../components/PackageCard.vue'
import TestimonialCard from '../components/TestimonialCard.vue'

const router = useRouter()
const searchQuery = ref('')
const featuredDests = ref([])
const featuredPkgs = ref([])
const testimonials = ref([])
const loadingDest = ref(true)
const loadingPkg = ref(true)

const stats = [
  { value: '200+', label: 'Destinasi' },
  { value: '50K+', label: 'Traveler' },
  { value: '4.9★', label: 'Rating' },
]

const features = [
  { icon: '🛡️', title: 'Terpercaya', desc: 'Lebih dari 50.000 traveler puas dengan layanan kami sejak 2018' },
  { icon: '💰', title: 'Harga Terbaik', desc: 'Jaminan harga terbaik, bebas biaya tersembunyi' },
  { icon: '🎯', title: 'Itinerary Lengkap', desc: 'Setiap perjalanan dirancang detail oleh tim ahli kami' },
  { icon: '📞', title: 'Bantuan 24/7', desc: 'Tim kami siap membantu Anda kapan saja dan di mana saja' },
]

function goSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/destinations', query: { search: searchQuery.value } })
  } else {
    router.push('/destinations')
  }
}

onMounted(async () => {
  try {
    const [dRes, pRes, tRes] = await Promise.all([
      api.get('/destinations/featured'),
      api.get('/packages/featured'),
      api.get('/testimonials'),
    ])
    featuredDests.value = dRes.data
    featuredPkgs.value = pRes.data
    testimonials.value = tRes.data.slice(0, 3)
  } catch {
    // silently fail
  } finally {
    loadingDest.value = false
    loadingPkg.value = false
  }
})
</script>
