<template>
  <div class="pt-20 min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-12">
      <RouterLink to="/packages" class="text-primary-500 hover:text-primary-700 text-sm font-medium flex items-center gap-1 mb-6">
        ← Kembali ke Paket
      </RouterLink>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <template v-else-if="pkg">
        <!-- Package Summary -->
        <div class="bg-white rounded-2xl p-5 shadow-card mb-6">
          <div class="flex gap-4">
            <img :src="pkg.image || `https://picsum.photos/seed/pkg${pkg.id}/200/150`" :alt="pkg.title"
              class="w-24 h-20 rounded-xl object-cover shrink-0" />
            <div>
              <h2 class="font-bold text-gray-900 text-lg">{{ pkg.title }}</h2>
              <p class="text-gray-500 text-sm mt-1">📍 {{ pkg.Destination?.name }}, {{ pkg.Destination?.country }}</p>
              <p class="text-primary-600 font-bold mt-2">{{ formatPrice(pkg.price) }}/orang</p>
            </div>
          </div>
        </div>

        <!-- Booking Form -->
        <div class="bg-white rounded-2xl p-6 shadow-card">
          <h1 class="font-display text-2xl font-bold text-navy mb-6">Detail Pemesanan</h1>

          <form @submit.prevent="submitBooking" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Keberangkatan</label>
              <input v-model="form.travel_date" type="date" class="input-field" required
                :min="minDate" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Peserta</label>
              <div class="flex items-center gap-3">
                <button type="button" @click="form.num_people = Math.max(1, form.num_people - 1)"
                  class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-primary-50 text-gray-700 font-bold transition-colors">−</button>
                <span class="text-xl font-bold text-gray-900 w-12 text-center">{{ form.num_people }}</span>
                <button type="button" @click="form.num_people = Math.min(pkg.max_people, form.num_people + 1)"
                  class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-primary-50 text-gray-700 font-bold transition-colors">+</button>
                <span class="text-gray-400 text-sm">(Max {{ pkg.max_people }})</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
              <textarea v-model="form.notes" rows="3" class="input-field resize-none"
                placeholder="Permintaan khusus, alergi makanan, dll..."></textarea>
            </div>

            <!-- Price Summary -->
            <div class="bg-primary-50 rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 mb-3">Ringkasan Harga</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between text-gray-600">
                  <span>{{ formatPrice(pkg.price) }} × {{ form.num_people }} orang</span>
                  <span>{{ formatPrice(pkg.price * form.num_people) }}</span>
                </div>
                <div class="flex justify-between font-bold text-gray-900 text-base border-t border-primary-200 pt-2 mt-2">
                  <span>Total</span>
                  <span class="text-primary-600">{{ formatPrice(pkg.price * form.num_people) }}</span>
                </div>
              </div>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {{ error }}
            </div>
            <div v-if="success" class="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
              ✅ Booking berhasil! Kami akan segera mengkonfirmasi pemesanan Anda.
            </div>

            <button type="submit" class="btn-primary w-full text-base !py-4" :disabled="submitting">
              <span v-if="submitting">⏳ Memproses...</span>
              <span v-else>Konfirmasi Pemesanan</span>
            </button>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const pkg = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const success = ref(false)
const form = ref({ travel_date: '', num_people: 1, notes: '' })
const minDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)

onMounted(async () => {
  try {
    const { data } = await api.get(`/packages/${route.params.packageId}`)
    pkg.value = data
  } catch { } finally { loading.value = false }
})

async function submitBooking() {
  error.value = ''
  if (!form.value.travel_date) { error.value = 'Pilih tanggal keberangkatan'; return }
  submitting.value = true
  try {
    await api.post('/bookings', { package_id: pkg.value.id, ...form.value })
    success.value = true
    setTimeout(() => router.push('/my-bookings'), 2000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Terjadi kesalahan, coba lagi'
  } finally { submitting.value = false }
}
</script>
