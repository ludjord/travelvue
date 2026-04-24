<template>
  <div class="pt-20 min-h-screen">
    <!-- Header -->
    <div class="bg-gradient-to-r from-navy to-primary-800 py-16 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="font-display text-4xl md:text-5xl font-bold text-white mb-3">Semua Destinasi</h1>
        <p class="text-white/70 text-lg">Temukan destinasi impian Anda dari ratusan pilihan terbaik kami</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="flex-1 relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input v-model="search" type="text" placeholder="Cari destinasi..."
            class="input-field pl-11" @input="debouncedSearch" />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button v-for="cat in categories" :key="cat.value"
            @click="selectedCat = cat.value; fetchDestinations()"
            class="px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border"
            :class="selectedCat === cat.value
              ? 'bg-primary-500 text-white border-primary-500 shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600'">
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 9" :key="i" class="card animate-pulse">
          <div class="aspect-[4/3] bg-gray-200 rounded-t-2xl"></div>
          <div class="p-4 space-y-2"><div class="h-4 bg-gray-200 rounded w-3/4"></div></div>
        </div>
      </div>
      <div v-else-if="destinations.length === 0" class="text-center py-20 text-gray-400">
        <div class="text-6xl mb-4">🏔️</div>
        <p class="text-xl font-medium">Destinasi tidak ditemukan</p>
        <p class="text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DestinationCard v-for="dest in destinations" :key="dest.id" :dest="dest" />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-10">
        <button v-for="p in totalPages" :key="p" @click="page = p; fetchDestinations()"
          class="w-10 h-10 rounded-xl font-medium text-sm transition-all duration-200"
          :class="page === p ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'">
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import DestinationCard from '../components/DestinationCard.vue'

const route = useRoute()
const destinations = ref([])
const loading = ref(true)
const search = ref(route.query.search || '')
const selectedCat = ref('all')
const page = ref(1)
const totalPages = ref(1)

const categories = [
  { value: 'all', label: 'Semua', icon: '🌍' },
  { value: 'beach', label: 'Pantai', icon: '🏖️' },
  { value: 'mountain', label: 'Gunung', icon: '🏔️' },
  { value: 'cultural', label: 'Budaya', icon: '🏛️' },
  { value: 'adventure', label: 'Petualangan', icon: '🧗' },
  { value: 'nature', label: 'Alam', icon: '🌿' },
  { value: 'city', label: 'Kota', icon: '🏙️' },
]

async function fetchDestinations() {
  loading.value = true
  try {
    const { data } = await api.get('/destinations', {
      params: { search: search.value || undefined, category: selectedCat.value !== 'all' ? selectedCat.value : undefined, page: page.value, limit: 9 }
    })
    destinations.value = data.data
    totalPages.value = data.totalPages
  } catch { destinations.value = [] }
  finally { loading.value = false }
}

let searchTimer = null
function debouncedSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; fetchDestinations() }, 400)
}

onMounted(fetchDestinations)
</script>
