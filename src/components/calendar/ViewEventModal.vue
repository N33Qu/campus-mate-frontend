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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const emit = defineEmits(['close', 'edit', 'delete'])
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-2xl font-bold mb-3">{{ event.eventName }}</h3>
      <div class="flex gap-2 justify-end">
        <template v-if="canEdit">
          <button
              @click="$emit('edit')"
              class="text-editButton pb-5 pr-4 rounded hover:text-editButtonHover transition-colors"
          >
            <i class="pi pi-pencil" @click="$emit('edit')"></i>
          </button>
          <button
              @click="$emit('delete')"
              class="text-deleteButton pb-5 pr-4 rounded hover:text-deleteButtonHover transition-colors"
          >
            <i class="pi pi-trash" @click="$emit('delete')"></i>
          </button>
        </template>
        <button
            @click="$emit('close')"
            class="text-gray-500 pb-5 rounded hover:text-gray-700 transition-colors"
        >
          <i class="pi pi-times" @click="$emit('close')"></i>
        </button>
      </div>

    </div>
    <p class="mb-2"><span class="font-semibold">Opis:</span> {{ event.eventDescription }}</p>
    <p class="mb-2">
      <span class="font-semibold">Rozpoczęcie:</span> {{ formatDate(event.startDate) }}
    </p>
    <p class="mb-4">
      <span class="font-semibold">Zakończenie:</span> {{ formatDate(event.endDate) }}
    </p>
  </div>
</template>