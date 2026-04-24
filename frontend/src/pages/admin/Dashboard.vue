<template>
  <div class="pt-20 min-h-screen bg-gray-50">
    <!-- Admin Header -->
    <div class="bg-navy text-white py-6 px-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold">Admin Dashboard</h1>
          <p class="text-white/60 text-sm mt-1">Selamat datang, {{ auth.user?.name }} 👋</p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/" class="text-white/70 hover:text-white text-sm transition-colors">← Kembali ke Site</RouterLink>
        </div>
      </div>
    </div>

    <!-- Admin Nav -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 flex gap-0">
        <RouterLink v-for="nav in adminNavs" :key="nav.to" :to="nav.to"
          class="px-5 py-4 text-sm font-medium border-b-2 transition-all duration-200"
          :class="$route.path === nav.to
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-800'">
          {{ nav.icon }} {{ nav.label }}
        </RouterLink>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-white rounded-2xl p-6 shadow-card flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" :class="stat.bg">
            {{ stat.icon }}
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
            <p class="text-gray-500 text-sm">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white rounded-2xl shadow-card overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-display text-xl font-bold text-navy">Booking Terbaru</h2>
          <RouterLink to="/admin/bookings" class="text-primary-500 hover:text-primary-700 text-sm font-medium">Lihat Semua →</RouterLink>
        </div>
        <div v-if="loadingBookings" class="p-6 text-center text-gray-400">Memuat...</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-6 py-3 text-gray-500 font-medium">Pelanggan</th>
                <th class="text-left px-6 py-3 text-gray-500 font-medium">Paket</th>
                <th class="text-left px-6 py-3 text-gray-500 font-medium">Tanggal</th>
                <th class="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
                <th class="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="b in recentBookings" :key="b.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">{{ b.User?.name }}</td>
                <td class="px-6 py-4 text-gray-600">{{ b.Package?.title?.slice(0, 30) }}...</td>
                <td class="px-6 py-4 text-gray-500">{{ new Date(b.travel_date).toLocaleDateString('id-ID') }}</td>
                <td class="px-6 py-4 font-semibold text-primary-600">{{ formatPrice(b.total_price) }}</td>
                <td class="px-6 py-4">
                  <span class="badge text-xs" :class="statusClass(b.status)">{{ b.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import api from '../../services/api'

const auth = useAuthStore()
const recentBookings = ref([])
const loadingBookings = ref(true)
const statsData = ref({})

const adminNavs = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/destinations', icon: '🗺️', label: 'Destinasi' },
  { to: '/admin/packages', icon: '📦', label: 'Paket' },
  { to: '/admin/bookings', icon: '📋', label: 'Booking' },
]

const stats = ref([
  { icon: '📋', label: 'Total Booking', value: '...', bg: 'bg-blue-100' },
  { icon: '💰', label: 'Total Revenue', value: '...', bg: 'bg-green-100' },
  { icon: '🗺️', label: 'Destinasi', value: '...', bg: 'bg-orange-100' },
  { icon: '👥', label: 'Pengguna', value: '...', bg: 'bg-purple-100' },
])

const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)
const statusClass = (s) => ({ pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', completed: 'bg-blue-100 text-blue-700' }[s] || 'bg-gray-100 text-gray-600')

onMounted(async () => {
  try {
    const [bookRes, statsRes] = await Promise.all([
      api.get('/bookings', { params: { limit: 10 } }),
      api.get('/bookings/stats'),
    ])
    recentBookings.value = bookRes.data.data
    const s = statsRes.data
    stats.value = [
      { icon: '📋', label: 'Total Booking', value: s.total_bookings || 0, bg: 'bg-blue-100' },
      { icon: '💰', label: 'Total Revenue', value: formatPrice(s.total_revenue || 0), bg: 'bg-green-100' },
      { icon: '🗺️', label: 'Destinasi', value: s.destinations || 0, bg: 'bg-orange-100' },
      { icon: '👥', label: 'Pengguna', value: s.users || 0, bg: 'bg-purple-100' },
    ]
  } catch { } finally { loadingBookings.value = false }
})
</script>
