<script setup>
import { onMounted, watch } from 'vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import AddressBookList from '@/components/addressBook/AddressBookList.vue';
import EditEntryModal from '@/components/addressBook/EditEntryModal.vue';
import { useAddressBook } from '@/composables/addressBook/useAddressBook.js';
import RiseLoader from "vue-spinner/src/RiseLoader.vue";
import ViewEntryModal from "@/components/addressBook/ViewEntryModal.vue";

const {
  entries,
  isLoading,
  error,
  searchQuery,
  selectedEntry,
  isEditModalOpen,
  isViewModalOpen,
  fetchEntries,
  searchEntries,
  deleteEntry,
  editEntry,
  updateEntry,
  viewEntry,
} = useAddressBook();

onMounted(fetchEntries);

watch(searchQuery, () => {
  const timeoutId = setTimeout(searchEntries, 500);
  return () => clearTimeout(timeoutId);
});
</script>

<template>
  <div class="min-h-screen bg-appBg p-6">
    <div class="max-w-4xl mx-auto bg-elementLight rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center py-6 text-headerText">
        Książka adresowa
      </h1>

      <div class="p-6">
        <SearchBar
            v-model="searchQuery"
            placeholder="Szukaj po imieniu i nazwisku"
        />
      </div>

      <div v-if="isLoading" class="text-center py-6">
        <RiseLoader color="#8b5cf6" />
      </div>

      <AddressBookList
          v-else-if="entries.length"
          :entries="entries"
          @delete="deleteEntry"
          @edit="editEntry"
          @view="viewEntry"
      />

      <div v-else class="text-center py-6 text-gray-500">
        {{ searchQuery.trim() ? 'Brak wyników wyszukiwania' : 'Wprowadź imię lub nazwisko, aby wyszukać' }}
      </div>
    </div>

    <EditEntryModal
        v-if="isEditModalOpen"
        :entry="selectedEntry"
        @close="isEditModalOpen = false"
        @save="updateEntry"
    />

    <ViewEntryModal
        v-if="isViewModalOpen"
        :entry="selectedEntry"
        @close="isViewModalOpen = false"
    />
  </div>
</template>