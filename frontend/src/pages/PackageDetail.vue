<template>
  <div class="pt-20 min-h-screen">
    <div v-if="loading" class="flex items-center justify-center h-96">
      <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="!pkg" class="text-center py-20 text-gray-400">
      <div class="text-6xl mb-4">😕</div><p>Paket tidak ditemukan</p>
    </div>
    <div v-else>
      <!-- Hero -->
      <div class="relative h-72 md:h-96 overflow-hidden">
        <img :src="pkg.image || `https://picsum.photos/seed/pkg${pkg.id}/1400/600`" :alt="pkg.title" class="w-full h-full object-cover"/>
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="max-w-7xl mx-auto">
            <span class="badge bg-primary-500 text-white mb-3">📍 {{ pkg.Destination?.name }}, {{ pkg.Destination?.country }}</span>
            <h1 class="font-display text-3xl md:text-4xl font-bold text-white text-shadow">{{ pkg.title }}</h1>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Description -->
            <div class="bg-white rounded-2xl p-6 shadow-card">
              <h2 class="font-display text-2xl font-bold text-navy mb-3">Deskripsi Paket</h2>
              <p class="text-gray-600 leading-relaxed">{{ pkg.description }}</p>
              <div class="grid grid-cols-3 gap-4 mt-6 bg-primary-50 rounded-xl p-4">
                <div class="text-center">
                  <div class="text-2xl mb-1">🗓️</div>
                  <div class="font-bold text-gray-900">{{ pkg.duration }} Hari</div>
                  <div class="text-gray-500 text-xs">Durasi</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl mb-1">👥</div>
                  <div class="font-bold text-gray-900">Max {{ pkg.max_people }}</div>
                  <div class="text-gray-500 text-xs">Peserta</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl mb-1">⭐</div>
                  <div class="font-bold text-gray-900">Premium</div>
                  <div class="text-gray-500 text-xs">Layanan</div>
                </div>
              </div>
            </div>

            <!-- Includes -->
            <div v-if="pkg.includes?.length" class="bg-white rounded-2xl p-6 shadow-card">
              <h2 class="font-display text-xl font-bold text-navy mb-4">Yang Sudah Termasuk</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="(item, i) in pkg.includes" :key="i" class="flex items-start gap-2 text-sm text-gray-700">
                  <span class="text-primary-500 mt-0.5 shrink-0">✓</span> {{ item }}
                </div>
              </div>
            </div>

            <!-- Itinerary -->
            <div v-if="pkg.itinerary?.length" class="bg-white rounded-2xl p-6 shadow-card">
              <h2 class="font-display text-xl font-bold text-navy mb-6">Jadwal Perjalanan</h2>
              <div class="space-y-4">
                <div v-for="day in pkg.itinerary" :key="day.day" class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {{ day.day }}
                    </div>
                    <div class="flex-1 w-0.5 bg-primary-100 mt-2"></div>
                  </div>
                  <div class="pb-6">
                    <h3 class="font-semibold text-gray-900">Hari {{ day.day }}: {{ day.title }}</h3>
                    <p class="text-gray-500 text-sm mt-1">{{ day.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Sidebar -->
          <div>
            <div class="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <div class="text-center mb-6">
                <p class="text-gray-500 text-sm">Mulai dari</p>
                <p class="text-4xl font-bold text-primary-600">{{ formatPrice(pkg.price) }}</p>
                <p class="text-gray-400 text-sm">/orang</p>
              </div>
              <div class="space-y-3 text-sm text-gray-600 mb-6 border-t border-b border-gray-100 py-4">
                <div class="flex justify-between">
                  <span>Durasi</span><span class="font-medium">{{ pkg.duration }} Hari</span>
                </div>
                <div class="flex justify-between">
                  <span>Max Peserta</span><span class="font-medium">{{ pkg.max_people }} orang</span>
                </div>
                <div class="flex justify-between">
                  <span>Destinasi</span><span class="font-medium">{{ pkg.Destination?.name }}</span>
                </div>
              </div>
              <RouterLink :to="`/booking/${pkg.id}`" class="btn-primary w-full text-center block">
                Pesan Sekarang
              </RouterLink>
              <p class="text-center text-gray-400 text-xs mt-3">Gratis pembatalan 48 jam sebelum keberangkatan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const pkg = ref(null)
const loading = ref(true)
const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)

onMounted(async () => {
  try {
    const { data } = await api.get(`/packages/${route.params.id}`)
    pkg.value = data
  } catch { } finally { loading.value = false }
})
</script>
