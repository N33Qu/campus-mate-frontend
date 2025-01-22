<template>
  <div class="flex justify-between items-center mb-4 gap-4">
    <button 
      @click="$emit('previous-week')" 
      class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Poprzedni tydzień
    </button>
    
    <span class="font-medium text-gray-800">
      {{ formattedDateRange }}
    </span>
    
    <button 
      @click="$emit('next-week')" 
      class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
    >
      Następny tydzień
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

defineEmits(['previous-week', 'next-week']);

const formattedDateRange = computed(() => {
  return `${props.startDate.toLocaleDateString()} - ${props.endDate.toLocaleDateString()}`;
});
</script>