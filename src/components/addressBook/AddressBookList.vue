<script setup>
import AddressBookEntry from './AddressBookEntry.vue';

defineProps({
  entries: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['delete', 'edit', 'view']);
</script>

<template>
  <div class="divide-y divide-stone-200">
    <AddressBookEntry
        v-for="entry in entries"
        :key="entry.entryId"
        :entry="entry"
        @delete="(entryId) => emit('delete', entryId)"
        @edit="() => emit('edit', entry)"
        @view="() => emit('view', entry)"
    />
  </div>
</template>