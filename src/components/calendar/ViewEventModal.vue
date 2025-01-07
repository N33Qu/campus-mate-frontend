<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit', 'delete'])
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    <h3 class="text-xl font-bold mb-4">{{ event.title }}</h3>
    <p class="mb-2"><span class="font-semibold">Description:</span> {{ event.description }}</p>
    <p class="mb-2">
      <span class="font-semibold">Start:</span> {{ new Date(event.start).toLocaleString() }}
    </p>
    <p class="mb-4">
      <span class="font-semibold">End:</span> {{ new Date(event.end).toLocaleString() }}
    </p>
    <div class="flex gap-2">
      <button
          @click="$emit('edit')"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Edit
      </button>
      <button
          @click="$emit('delete')"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
      <button
          @click="$emit('close')"
          class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
</template>

