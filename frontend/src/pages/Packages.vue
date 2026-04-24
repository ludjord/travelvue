<template>
  <div class="pt-20 min-h-screen">
    <div class="bg-gradient-to-r from-navy to-primary-800 py-16 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="font-display text-4xl md:text-5xl font-bold text-white mb-3">Paket Wisata</h1>
        <p class="text-white/70 text-lg">Pilihan paket wisata terlengkap dengan layanan terbaik</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="loading" v-for="i in 6" :key="i" class="card animate-pulse">
          <div class="aspect-video bg-gray-200 rounded-t-2xl"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-100 rounded w-3/4"></div>
          </div>
        </div>
        <template v-else>
          <PackageCard v-for="pkg in packages" :key="pkg.id" :pkg="pkg" />
        </template>
      </div>
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-10">
        <button v-for="p in totalPages" :key="p" @click="page = p; fetchPackages()"
          class="w-10 h-10 rounded-xl font-medium text-sm transition-all duration-200"
          :class="page === p ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'">
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import PackageCard from '../components/PackageCard.vue'

const packages = ref([])
const loading = ref(true)
const page = ref(1)
const totalPages = ref(1)

async function fetchPackages() {
  loading.value = true
  try {
    const { data } = await api.get('/packages', { params: { page: page.value, limit: 9 } })
    packages.value = data.data
    totalPages.value = data.totalPages
  } catch { } finally { loading.value = false }
}
onMounted(fetchPackages)
</script>
