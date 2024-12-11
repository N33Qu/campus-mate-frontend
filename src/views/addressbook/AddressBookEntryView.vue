<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import api from '@/axios.js'
import AddressBookEntry from "@/components/addressBook/AddressBookEntry.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const addressBookEntryId = route.params.id;
const state = ref({
    addressBookEntry: {},
    isLoading: true,
});

const deleteJob = async () => {
  try {
    const confirm = window.confirm('Are you sure you want to delete this entry?');
    if (confirm) {
      await api.delete(`/api/adressbook/entry/${addressBookEntryId}`);
      toast.success('Entry Deleted Successfully');
      await router.push('/addressbook');
    }
  } catch (error) {
    console.error('Error deleting entry', error);
    toast.error('Entry Not Deleted');
  }

  onMounted(async () => {
    try {
      const response = await api.get(`/addressbook/entries/${addressBookEntryId}`);
      state.job = response.data;
    } catch (error) {
      console.error('Error fetching entry', error);
    } finally {
      state.isLoading = false;
    }
  });
};

</script>

<template>
  <AddressBookEntry entry="state.addressBookEntry" />
</template>
