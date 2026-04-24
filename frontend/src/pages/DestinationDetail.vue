<template>
  <div class="pt-20 min-h-screen">
    <div v-if="loading" class="flex items-center justify-center h-96">
      <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="!dest" class="flex items-center justify-center h-96 text-gray-400">
      <div class="text-center"><div class="text-6xl mb-4">😕</div><p>Destinasi tidak ditemukan</p></div>
    </div>
    <div v-else>
      <!-- Hero Image -->
      <div class="relative h-72 md:h-96 overflow-hidden">
        <img :src="dest.image || `https://picsum.photos/seed/${dest.id}/1400/600`" :alt="dest.name"
          class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8">
          <div class="max-w-7xl mx-auto">
            <span class="badge bg-primary-500 text-white mb-3">📍 {{ dest.country }}</span>
            <h1 class="font-display text-4xl md:text-5xl font-bold text-white text-shadow">{{ dest.name }}</h1>
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-1 text-gold-400">
                <span>★</span>
                <span class="text-white font-semibold">{{ dest.rating }}</span>
                <span class="text-white/60 text-sm">({{ dest.review_count?.toLocaleString() }} ulasan)</span>
              </div>
              <span class="text-white/60">•</span>
              <span class="text-white/80 text-sm capitalize">{{ dest.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Description -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl p-6 shadow-card mb-6">
              <h2 class="font-display text-2xl font-bold text-navy mb-4">Tentang {{ dest.name }}</h2>
              <p class="text-gray-600 leading-relaxed">{{ dest.description }}</p>
            </div>

            <!-- Available Packages -->
            <div>
              <h2 class="font-display text-2xl font-bold text-navy mb-6">Paket Tersedia</h2>
              <div v-if="packages.length === 0" class="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl">
                <div class="text-4xl mb-2">📭</div>
                <p>Belum ada paket untuk destinasi ini</p>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PackageCard v-for="pkg in packages" :key="pkg.id" :pkg="pkg" />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div>
            <div class="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h3 class="font-bold text-gray-900 mb-4">Informasi Destinasi</h3>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center justify-between py-2 border-b border-gray-50">
                  <span class="text-gray-500">Negara</span>
                  <span class="font-medium">{{ dest.country }}</span>
                </li>
                <li class="flex items-center justify-between py-2 border-b border-gray-50">
                  <span class="text-gray-500">Kota</span>
                  <span class="font-medium">{{ dest.city || '-' }}</span>
                </li>
                <li class="flex items-center justify-between py-2 border-b border-gray-50">
                  <span class="text-gray-500">Kategori</span>
                  <span class="font-medium capitalize">{{ dest.category }}</span>
                </li>
                <li class="flex items-center justify-between py-2">
                  <span class="text-gray-500">Rating</span>
                  <span class="font-medium text-gold-500">★ {{ dest.rating }}</span>
                </li>
              </ul>
              <RouterLink to="/packages" class="btn-primary w-full text-center block mt-6">
                Lihat Semua Paket
              </RouterLink>
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
import PackageCard from '../components/PackageCard.vue'

const route = useRoute()
const dest = ref(null)
const packages = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [dRes, pRes] = await Promise.all([
      api.get(`/destinations/${route.params.id}`),
      api.get('/packages', { params: { destination_id: route.params.id, limit: 6 } }),
    ])
    dest.value = dRes.data
    packages.value = pRes.data.data
  } catch { }
  finally { loading.value = false }
})
</script>
