<script setup>
import { ref } from 'vue'

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
})

const isOpen = ref(false)

const toggleAnswer = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="border-b border-gray-200 py-4">
    <button
        @click="toggleAnswer"
        class="w-full flex justify-between items-center text-left focus:outline-none"
    >
      <span class="text-lg font-semibold" style="color: #4e4945;">
        {{ question }}
      </span>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 transform transition-transform duration-300"
          :class="isOpen ? 'rotate-180' : ''"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#4e4945"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div
        v-if="isOpen"
        class="mt-4 text-gray-600 transition-all duration-300 ease-in-out"
    >
      {{ answer }}
    </div>
  </div>
</template>