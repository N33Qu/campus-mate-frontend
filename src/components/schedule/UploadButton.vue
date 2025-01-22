<template>
  <button 
    @click="handleClick"
    :disabled="isLoading"
    class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
    :class="buttonStyles"
  >
    <!-- Simple upload icon using inline SVG -->
    <svg 
      v-if="!isLoading"
      xmlns="http://www.w3.org/2000/svg" 
      class="h-5 w-5" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
    <!-- Loading spinner -->
    <svg 
      v-else
      class="animate-spin h-5 w-5" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        class="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        stroke-width="4"
      />
      <path 
        class="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <span>{{ isLoading ? 'Dodawanie...' : 'Dodaj plan' }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  }
});

const emit = defineEmits(['click']);

const buttonStyles = computed(() => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300'
  }
  return variants[props.variant];
});

const handleClick = () => {
  if (!props.isLoading) {
    emit('click');
  }
};
</script>