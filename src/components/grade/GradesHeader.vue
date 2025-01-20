<script setup>
const props = defineProps({
  rowCount: {
    type: Number,
    required: true
  },
  averageGrade: {
    type: [String, Number],
    required: true
  },
  canManageGrades: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['add-grade', 'refresh']);
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-black">Moje oceny</h2>
      <button
          @click="emit('refresh')"
          class="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title="Refresh grades"
      >
        <svg
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
    <div class="flex items-center justify-between gap-4">
      <button
          v-if="canManageGrades"
          @click="emit('add-grade')"
          class="bg-button hover:bg-buttonHover text-white text-xs font-bold py-2 px-4 rounded transition duration-300"
      >
        Dodaj ocene
      </button>
      <div class="flex items-center space-x-4">
        <span class="font-semibold">Liczba ocen: {{ rowCount }}</span>
        <span class="font-semibold">Średnia ocen: {{ averageGrade }}</span>
      </div>
    </div>
  </div>
</template>