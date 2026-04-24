<template>
  <div class="bg-white rounded-2xl p-6 shadow-card border border-gray-100 relative">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg shrink-0">
        {{ testimonial.User?.name?.charAt(0) }}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold text-gray-900">{{ testimonial.User?.name }}</h4>
          <div class="flex text-gold-500 text-sm">
            <span v-for="i in 5" :key="i">{{ i <= testimonial.rating ? '★' : '☆' }}</span>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-0.5">
          {{ testimonial.Package?.Destination?.name || testimonial.Package?.title }}
        </p>
        <p class="text-gray-600 text-sm mt-3 leading-relaxed">"{{ testimonial.content }}"</p>
      </div>
    </div>
    <!-- Quote icon -->
    <div class="absolute top-4 right-4 text-primary-100 text-4xl font-display leading-none select-none">"</div>
  </div>
</template>

<script setup>
defineProps({ testimonial: Object })
</script>
