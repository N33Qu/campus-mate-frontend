<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'edit', 'delete'])
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    <h3 class="text-xl font-bold mb-4">{{ event.eventName }}</h3>
    <p class="mb-2"><span class="font-semibold">Opis:</span> {{ event.eventDescription }}</p>
    <p class="mb-2">
      <span class="font-semibold">Rozpoczęcie:</span> {{ new Date(event.startDate).toLocaleString() }}
    </p>
    <p class="mb-4">
      <span class="font-semibold">Zakończenie:</span> {{ new Date(event.endDate).toLocaleString() }}
    </p>
    <div class="flex gap-2">
      <template v-if="canEdit">
        <button
            @click="$emit('edit')"
            class="bg-editButton text-white px-4 py-2 rounded hover:bg-editButtonHover transition-colors"
        >
          Edytuj
        </button>
        <button
            @click="$emit('delete')"
            class="bg-deleteButton text-white px-4 py-2 rounded hover:bg-deleteButtonHover transition-colors"
        >
          Usuń
        </button>
      </template>
      <button
          @click="$emit('close')"
          class="bg-cancelButton text-white px-4 py-2 rounded hover:bg-cancelButtonHover transition-colors"
      >
        Zamknij
      </button>
    </div>
  </div>
</template>