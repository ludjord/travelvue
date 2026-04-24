<template>
  <div class="pt-20 min-h-screen bg-gray-50">
    <div class="bg-navy text-white py-6 px-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold">Kelola Booking</h1>
          <p class="text-white/60 text-sm mt-1">Manajemen pemesanan perjalanan pelanggan</p>
        </div>
      </div>
    </div>
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 flex gap-0">
        <RouterLink v-for="nav in adminNavs" :key="nav.to" :to="nav.to"
          class="px-5 py-4 text-sm font-medium border-b-2 transition-all"
          :class="$route.path === nav.to ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'">
          {{ nav.icon }} {{ nav.label }}
        </RouterLink>
      </div>
    </div>

    <!-- Status Filter -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex gap-2 flex-wrap mb-6">
        <button v-for="s in statusFilters" :key="s.value" @click="statusFilter = s.value; fetchBookings()"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
          :class="statusFilter === s.value ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'">
          {{ s.icon }} {{ s.label }}
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-5 py-3 text-gray-500">#</th>
                <th class="text-left px-5 py-3 text-gray-500">Pelanggan</th>
                <th class="text-left px-5 py-3 text-gray-500">Paket</th>
                <th class="text-left px-5 py-3 text-gray-500">Tanggal</th>
                <th class="text-left px-5 py-3 text-gray-500">Peserta</th>
                <th class="text-left px-5 py-3 text-gray-500">Total</th>
                <th class="text-left px-5 py-3 text-gray-500">Status</th>
                <th class="text-left px-5 py-3 text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="loading">
                <td colspan="8" class="px-5 py-10 text-center text-gray-400">Memuat...</td>
              </tr>
              <tr v-else-if="bookings.length === 0">
                <td colspan="8" class="px-5 py-10 text-center text-gray-400">Tidak ada data booking</td>
              </tr>
              <tr v-for="b in bookings" :key="b.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-4 text-gray-400">#{{ b.id }}</td>
                <td class="px-5 py-4">
                  <p class="font-medium text-gray-900">{{ b.User?.name }}</p>
                  <p class="text-gray-400 text-xs">{{ b.User?.phone }}</p>
                </td>
                <td class="px-5 py-4 text-gray-600 max-w-xs">
                  <p class="truncate">{{ b.Package?.title }}</p>
                  <p class="text-gray-400 text-xs">{{ b.Package?.Destination?.name }}</p>
                </td>
                <td class="px-5 py-4 text-gray-500">{{ new Date(b.travel_date).toLocaleDateString('id-ID') }}</td>
                <td class="px-5 py-4 text-gray-600">{{ b.num_people }} orang</td>
                <td class="px-5 py-4 font-semibold text-primary-600">{{ formatPrice(b.total_price) }}</td>
                <td class="px-5 py-4">
                  <span class="badge text-xs" :class="statusClass(b.status)">{{ b.status }}</span>
                </td>
                <td class="px-5 py-4">
                  <select :value="b.status" @change="updateStatus(b.id, $event.target.value)"
                    class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary-400">
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
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
import api from '../../services/api'

const adminNavs = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/destinations', icon: '🗺️', label: 'Destinasi' },
  { to: '/admin/packages', icon: '📦', label: 'Paket' },
  { to: '/admin/bookings', icon: '📋', label: 'Booking' },
]

const statusFilters = [
  { value: '', label: 'Semua', icon: '📋' },
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'confirmed', label: 'Dikonfirmasi', icon: '✅' },
  { value: 'completed', label: 'Selesai', icon: '🏆' },
  { value: 'cancelled', label: 'Dibatalkan', icon: '❌' },
]

const bookings = ref([])
const loading = ref(true)
const statusFilter = ref('')

const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)
const statusClass = (s) => ({ pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', completed: 'bg-blue-100 text-blue-700' }[s] || 'bg-gray-100 text-gray-600')

async function fetchBookings() {
  loading.value = true
  try {
    const params = { limit: 50 }
    if (statusFilter.value) params.status = statusFilter.value
    const { data } = await api.get('/bookings', { params })
    bookings.value = data.data
  } catch { } finally { loading.value = false }
}

async function updateStatus(id, status) {
  try {
    await api.put(`/bookings/${id}/status`, { status })
    const b = bookings.value.find(x => x.id === id)
    if (b) b.status = status
  } catch { alert('Gagal update status') }
}

onMounted(fetchBookings)
</script>
