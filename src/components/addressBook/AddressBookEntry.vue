<script setup>
defineProps({
  entry: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete', 'edit', 'view']);
</script>

<template>
  <div
      class="p-4 hover:bg-stone-100 transition-colors cursor-pointer"
      @click="emit('view', entry)"
  >
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold text-stone-700">
          {{ entry.contactName }}
        </h3>
        <div class="text-stone-600 space-y-1">
          <p>
            <span class="font-medium">Email:</span>
            {{ entry.email }}
          </p>
          <p>
            <span class="font-medium">Telefon:</span>
            {{ entry.phoneNumber }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <button
            @click.stop="emit('edit', entry)"
            class="p-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          Edytuj
        </button>
        <button
            @click.stop="emit('delete', entry.entryId)"
            class="p-2 text-red-600 hover:text-red-800 transition-colors"
        >
          Usuń
        </button>
      </div>
    </div>
  </div>
</template>