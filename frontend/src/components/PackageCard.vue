<template>
  <div class="card group">
    <div class="relative overflow-hidden aspect-video">
      <img :src="pkg.image || `https://picsum.photos/seed/pkg${pkg.id}/800/450`"
        :alt="pkg.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div class="absolute inset-0 bg-card-gradient"></div>
      <div v-if="pkg.is_featured" class="absolute top-3 left-3">
        <span class="badge bg-gold-500 text-white">⭐ Best Seller</span>
      </div>
      <div class="absolute bottom-3 left-3">
        <span class="text-white/80 text-sm flex items-center gap-1">
          📍 {{ pkg.Destination?.name }}, {{ pkg.Destination?.country }}
        </span>
      </div>
    </div>
    <div class="p-5">
      <h3 class="font-display font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-primary-600 transition-colors">
        {{ pkg.title }}
      </h3>
      <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{ pkg.description }}</p>
      
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span class="flex items-center gap-1"><span>🗓️</span> {{ pkg.duration }} Hari</span>
        <span class="flex items-center gap-1"><span>👥</span> Max {{ pkg.max_people }} orang</span>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-400">Mulai dari</p>
          <p class="text-2xl font-bold text-primary-600">
            {{ formatPrice(pkg.price) }}
          </p>
          <p class="text-xs text-gray-400">/orang</p>
        </div>
        <RouterLink :to="`/packages/${pkg.id}`" class="btn-primary text-sm !py-2.5 !px-5">
          Pilih Paket
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ pkg: Object })
const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p)
</script>
