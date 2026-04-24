<template>
  <RouterLink :to="`/destinations/${dest.id}`" class="card group block">
    <div class="relative overflow-hidden aspect-[4/3]">
      <img :src="dest.image || `https://picsum.photos/seed/${dest.id}/800/600`"
        :alt="dest.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div class="absolute inset-0 bg-card-gradient"></div>
      <div class="absolute top-3 left-3">
        <span class="badge text-white" :class="categoryColor(dest.category)">
          {{ categoryIcon(dest.category) }} {{ dest.category }}
        </span>
      </div>
      <div v-if="dest.is_featured" class="absolute top-3 right-3">
        <span class="badge bg-gold-500 text-white">⭐ Featured</span>
      </div>
      <div class="absolute bottom-3 left-3 right-3">
        <h3 class="font-display font-bold text-white text-xl text-shadow">{{ dest.name }}</h3>
        <p class="text-white/80 text-sm flex items-center gap-1 mt-1">
          <span>📍</span> {{ dest.city ? dest.city + ', ' : '' }}{{ dest.country }}
        </p>
      </div>
    </div>
    <div class="p-4">
      <p class="text-gray-500 text-sm line-clamp-2">{{ dest.description }}</p>
      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center gap-1">
          <span class="text-gold-500">★</span>
          <span class="font-semibold text-gray-800 text-sm">{{ dest.rating }}</span>
          <span class="text-gray-400 text-xs">({{ dest.review_count?.toLocaleString() }})</span>
        </div>
        <span class="text-primary-500 font-semibold text-sm group-hover:underline">Lihat →</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({ dest: Object })

const categoryColor = (cat) => ({
  beach: 'bg-blue-500/80',
  mountain: 'bg-green-600/80',
  city: 'bg-purple-600/80',
  cultural: 'bg-orange-500/80',
  adventure: 'bg-red-600/80',
  nature: 'bg-emerald-600/80',
}[cat] || 'bg-gray-600/80')

const categoryIcon = (cat) => ({
  beach: '🏖️', mountain: '🏔️', city: '🏙️',
  cultural: '🏛️', adventure: '🧗', nature: '🌿',
}[cat] || '🌍')
</script>
