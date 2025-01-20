<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p class="text-gray-600 mb-6">{{ message }}</p>

      <div class="flex justify-end gap-4">
        <button
            @click="emit('cancel')"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg"
        >
          Anuluj
        </button>
        <button
            @click="emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Usuń
        </button>
      </div>
    </div>
  </div>
</template>