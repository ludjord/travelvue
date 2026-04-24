<template>
  <div class="pt-20 min-h-screen bg-gray-50">
    <div class="bg-navy text-white py-6 px-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold">Kelola Destinasi</h1>
          <p class="text-white/60 text-sm mt-1">Tambah, edit, dan hapus destinasi wisata</p>
        </div>
        <button @click="openModal()" class="btn-gold text-sm">+ Tambah Destinasi</button>
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-5 py-3 text-gray-500">Destinasi</th>
                <th class="text-left px-5 py-3 text-gray-500">Lokasi</th>
                <th class="text-left px-5 py-3 text-gray-500">Kategori</th>
                <th class="text-left px-5 py-3 text-gray-500">Rating</th>
                <th class="text-left px-5 py-3 text-gray-500">Featured</th>
                <th class="text-left px-5 py-3 text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="d in destinations" :key="d.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <img :src="d.image || `https://picsum.photos/seed/${d.id}/60/45`" class="w-12 h-9 object-cover rounded-lg" />
                    <span class="font-medium text-gray-900">{{ d.name }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-gray-500">{{ d.city }}, {{ d.country }}</td>
                <td class="px-5 py-4 capitalize text-gray-600">{{ d.category }}</td>
                <td class="px-5 py-4 text-gold-500 font-medium">★ {{ d.rating }}</td>
                <td class="px-5 py-4">
                  <span class="badge" :class="d.is_featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ d.is_featured ? '✓ Ya' : '✗ Tidak' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <button @click="openModal(d)" class="text-primary-500 hover:text-primary-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">Edit</button>
                    <button @click="deleteItem(d.id)" class="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Hapus</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-bold text-lg text-gray-900">{{ editing ? 'Edit' : 'Tambah' }} Destinasi</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <form @submit.prevent="saveDestination" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Nama *</label>
              <input v-model="form.name" type="text" class="input-field" required />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Negara *</label>
              <input v-model="form.country" type="text" class="input-field" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Kota</label>
              <input v-model="form.city" type="text" class="input-field" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Kategori</label>
              <select v-model="form.category" class="input-field">
                <option value="beach">Pantai</option>
                <option value="mountain">Gunung</option>
                <option value="city">Kota</option>
                <option value="cultural">Budaya</option>
                <option value="adventure">Petualangan</option>
                <option value="nature">Alam</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Deskripsi</label>
            <textarea v-model="form.description" rows="3" class="input-field resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Rating (0-5)</label>
              <input v-model="form.rating" type="number" step="0.1" min="0" max="5" class="input-field" />
            </div>
            <div class="flex items-end pb-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.is_featured" type="checkbox" class="w-4 h-4 accent-primary-500" />
                <span class="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Gambar</label>
            <input type="file" accept="image/*" @change="handleFile" class="input-field text-sm" />
          </div>
          <div v-if="saveError" class="text-red-500 text-sm">{{ saveError }}</div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="showModal = false" class="btn-secondary flex-1">Batal</button>
            <button type="submit" class="btn-primary flex-1" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
          </div>
        </form>
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

const destinations = ref([])
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const saveError = ref('')
const fileRef = ref(null)

const defaultForm = () => ({ name: '', country: '', city: '', description: '', category: 'beach', rating: 4.5, is_featured: false })
const form = ref(defaultForm())

function openModal(dest = null) {
  editing.value = dest
  form.value = dest ? { name: dest.name, country: dest.country, city: dest.city, description: dest.description, category: dest.category, rating: dest.rating, is_featured: dest.is_featured } : defaultForm()
  saveError.value = ''
  showModal.value = true
}

function handleFile(e) { fileRef.value = e.target.files[0] }

async function saveDestination() {
  saving.value = true
  saveError.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (fileRef.value) fd.append('image', fileRef.value)
    if (editing.value) await api.put(`/destinations/${editing.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    else await api.post('/destinations', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    showModal.value = false
    await fetchDestinations()
  } catch (e) { saveError.value = e.response?.data?.message || 'Gagal menyimpan' }
  finally { saving.value = false }
}

async function deleteItem(id) {
  if (!confirm('Hapus destinasi ini?')) return
  try { await api.delete(`/destinations/${id}`); await fetchDestinations() } catch { }
}

async function fetchDestinations() {
  const { data } = await api.get('/destinations', { params: { limit: 100 } })
  destinations.value = data.data
}
onMounted(fetchDestinations)
</script>
