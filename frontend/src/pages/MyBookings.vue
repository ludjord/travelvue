<template>
  <div class="pt-20 min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="font-display text-3xl font-bold text-navy mb-2">Booking Saya</h1>
      <p class="text-gray-500 mb-8">Riwayat dan status pemesanan perjalanan Anda</p>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-6 shadow-card animate-pulse">
          <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-3 bg-gray-100 rounded w-3/4"></div>
        </div>
      </div>
      <div v-else-if="bookings.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📋</div>
        <h2 class="text-xl font-bold text-gray-700 mb-2">Belum ada booking</h2>
        <p class="text-gray-400 mb-6">Yuk, mulai petualangan pertama Anda!</p>
        <RouterLink to="/packages" class="btn-primary">Jelajahi Paket Wisata</RouterLink>
      </div>
      <div v-else class="space-y-4">
        <div v-for="b in bookings" :key="b.id"
          class="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
          <div class="flex flex-col md:flex-row">
            <div class="md:w-40 h-32 md:h-auto shrink-0">
              <img :src="b.Package?.image || `https://picsum.photos/seed/pkg${b.package_id}/300/200`"
                class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 p-5">
              <div class="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 class="font-bold text-gray-900 text-lg">{{ b.Package?.title }}</h3>
                  <p class="text-gray-500 text-sm mt-1">📍 {{ b.Package?.Destination?.name }}, {{ b.Package?.Destination?.country }}</p>
                </div>
                <span class="badge text-sm px-3 py-1.5" :class="statusClass(b.status)">
                  {{ statusIcon(b.status) }} {{ statusLabel(b.status) }}
                </span>
              </div>
              <div class="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">🗓️ {{ formatDate(b.travel_date) }}</span>
                <span class="flex items-center gap-1">👥 {{ b.num_people }} orang</span>
                <span class="flex items-center gap-1 font-semibold text-primary-600">
                  💰 {{ formatPrice(b.total_price) }}
                </span>
              </div>
              <p v-if="b.notes" class="text-gray-400 text-sm mt-2 italic">"{{ b.notes }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const bookings = ref([])
const loading = ref(true)

const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const statusClass = (s) => ({
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}[s] || 'bg-gray-100 text-gray-600')

const statusIcon = (s) => ({ pending: '⏳', confirmed: '✅', cancelled: '❌', completed: '🏆' }[s] || '•')
const statusLabel = (s) => ({ pending: 'Menunggu', confirmed: 'Dikonfirmasi', cancelled: 'Dibatalkan', completed: 'Selesai' }[s] || s)

onMounted(async () => {
  try {
    const { data } = await api.get('/bookings/my')
    bookings.value = data
  } catch { } finally { loading.value = false }
})
</script>
