<script setup>
import AddressBookEntry from './AddressBookEntry.vue';

defineProps({
  entries: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="divide-y divide-stone-200">
    <AddressBookEntry
        v-for="entry in entries"
        :key="entry.email"
        :entry="entry"
    />
  </div>
</template>