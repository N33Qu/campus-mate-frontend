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
      class="p-4 hover:bg-elementHover transition-colors cursor-pointer rounded-lg"
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
            type="button"
            @click.stop="emit('edit', entry)"
            class="p-2 text-white bg-editButton hover:bg-editButtonHover transition-colors rounded"
        >
          Edytuj
        </button>
        <button
            type="button"
            @click.stop="emit('delete', entry.entryId)"
            class="p-2 text-white bg-deleteButton hover:bg-deleteButtonHover transition-colors rounded"
        >
          Usuń
        </button>
      </div>
    </div>
  </div>
</template>