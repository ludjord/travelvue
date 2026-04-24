<template>
  <div class="pt-20 min-h-screen bg-gray-50">
    <div class="bg-navy text-white py-6 px-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold">Kelola Paket Wisata</h1>
          <p class="text-white/60 text-sm mt-1">Tambah, edit, dan hapus paket perjalanan</p>
        </div>
        <button @click="openModal()" class="btn-gold text-sm">+ Tambah Paket</button>
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

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-5 py-3 text-gray-500">Paket</th>
                <th class="text-left px-5 py-3 text-gray-500">Destinasi</th>
                <th class="text-left px-5 py-3 text-gray-500">Durasi</th>
                <th class="text-left px-5 py-3 text-gray-500">Harga</th>
                <th class="text-left px-5 py-3 text-gray-500">Featured</th>
                <th class="text-left px-5 py-3 text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="p in packages" :key="p.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <img :src="p.image || `https://picsum.photos/seed/pkg${p.id}/80/60`" class="w-14 h-10 object-cover rounded-lg shrink-0" />
                    <span class="font-medium text-gray-900 max-w-xs truncate">{{ p.title }}</span>
                  </div>
                </td>
                <td class="px-5 py-4 text-gray-500">{{ p.Destination?.name }}</td>
                <td class="px-5 py-4 text-gray-600">{{ p.duration }} hari</td>
                <td class="px-5 py-4 font-semibold text-primary-600">{{ formatPrice(p.price) }}</td>
                <td class="px-5 py-4">
                  <span class="badge" :class="p.is_featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ p.is_featured ? '✓ Ya' : '✗ Tidak' }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <button @click="openModal(p)" class="text-primary-500 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">Edit</button>
                    <button @click="deleteItem(p.id)" class="text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Hapus</button>
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
          <h2 class="font-bold text-lg text-gray-900">{{ editing ? 'Edit' : 'Tambah' }} Paket</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <form @submit.prevent="savePackage" class="p-6 space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Judul Paket *</label>
            <input v-model="form.title" type="text" class="input-field" required />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Destinasi *</label>
            <select v-model="form.destination_id" class="input-field" required>
              <option value="">Pilih destinasi</option>
              <option v-for="d in allDestinations" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Deskripsi</label>
            <textarea v-model="form.description" rows="3" class="input-field resize-none"></textarea>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Harga (Rp) *</label>
              <input v-model="form.price" type="number" min="0" class="input-field" required />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Durasi (hari) *</label>
              <input v-model="form.duration" type="number" min="1" class="input-field" required />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Max Orang</label>
              <input v-model="form.max_people" type="number" min="1" class="input-field" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="form.is_featured" type="checkbox" class="w-4 h-4 accent-primary-500" id="featuredChk" />
            <label for="featuredChk" class="text-sm font-medium text-gray-700">Featured / Best Seller</label>
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

const packages = ref([])
const allDestinations = ref([])
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const saveError = ref('')
const fileRef = ref(null)
const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)

const defaultForm = () => ({ title: '', destination_id: '', description: '', price: '', duration: '', max_people: 10, is_featured: false })
const form = ref(defaultForm())

function openModal(pkg = null) {
  editing.value = pkg
  form.value = pkg ? { title: pkg.title, destination_id: pkg.destination_id, description: pkg.description, price: pkg.price, duration: pkg.duration, max_people: pkg.max_people, is_featured: pkg.is_featured } : defaultForm()
  saveError.value = ''
  showModal.value = true
}

function handleFile(e) { fileRef.value = e.target.files[0] }

async function savePackage() {
  saving.value = true
  saveError.value = ''
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (fileRef.value) fd.append('image', fileRef.value)
    if (editing.value) await api.put(`/packages/${editing.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    else await api.post('/packages', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    showModal.value = false
    await fetchPackages()
  } catch (e) { saveError.value = e.response?.data?.message || 'Gagal menyimpan' }
  finally { saving.value = false }
}

async function deleteItem(id) {
  if (!confirm('Hapus paket ini?')) return
  try { await api.delete(`/packages/${id}`); await fetchPackages() } catch { }
}

async function fetchPackages() {
  const { data } = await api.get('/packages', { params: { limit: 100 } })
  packages.value = data.data
}
async function fetchDestinations() {
  const { data } = await api.get('/destinations', { params: { limit: 100 } })
  allDestinations.value = data.data
}
onMounted(() => { fetchPackages(); fetchDestinations() })
</script>
