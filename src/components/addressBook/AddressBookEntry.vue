<script setup>
import { useAddressBookPermissions } from '@/composables/addressBook/useAddressBookPermissions.js';

const props = defineProps({
  entry: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete', 'edit', 'view']);
const { canEditEntry, canDeleteEntry } = useAddressBookPermissions();
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
            v-if="canEditEntry(entry.userId)"
            type="button"
            @click.stop="emit('edit', entry)"
            class="p-2 text-editButton hover:text-editButtonHover transition-colors rounded"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
            v-if="canDeleteEntry()"
            type="button"
            @click.stop="emit('delete', entry.entryId)"
            class="p-2 text-deleteButton hover:text-deleteButtonHover transition-colors rounded"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>