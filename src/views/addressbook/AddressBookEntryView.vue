<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAddressBookEntry } from '@/services/addressBookService.js';
import AddressBookEntry from "@/components/addressBook/AddressBookEntry.vue";

const route = useRoute();
const addressBookEntryId = route.params.id;
const { state, deleteEntry, fetchEntry } = useAddressBookEntry(addressBookEntryId);

onMounted(fetchEntry);
</script>

<template>
  <AddressBookEntry :entry="state.addressBookEntry" />
</template>