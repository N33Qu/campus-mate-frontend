<script setup>
defineProps({
  entry: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-lg w-full">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Szczegóły wpisu</h2>
        <button
            @click="emit('close')"
            class="text-gray-500 hover:text-gray-700"
        >
          Zamknij
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold text-stone-900">
            {{ entry.contactName }}
          </h3>
        </div>

        <div class="space-y-2">
          <div class="flex border-b border-gray-200 py-2">
            <span class="font-medium w-1/3">Email:</span>
            <a
                :href="`mailto:${entry.email}`"
                class="text-blue-600 hover:text-blue-800"
            >
              {{ entry.email }}
            </a>
          </div>

          <div class="flex border-b border-gray-200 py-2">
            <span class="font-medium w-1/3">Telefon:</span>
            <a
                :href="`tel:${entry.phoneNumber}`"
                class="text-blue-600 hover:text-blue-800"
            >
              {{ entry.phoneNumber }}
            </a>
          </div>

          <div v-if="entry.classNumber" class="flex border-b border-gray-200 py-2">
            <span class="font-medium w-1/3">Numer klasy:</span>
            <span>{{ entry.classNumber }}</span>
          </div>

          <div v-if="entry.notes" class="py-2">
            <span class="font-medium block mb-1">Notatki:</span>
            <p class="text-gray-600 whitespace-pre-wrap">{{ entry.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>