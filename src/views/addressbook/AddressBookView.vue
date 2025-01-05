<script setup>
import { onMounted } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import AddressBookList from '@/components/addressBook/AddressBookList.vue';
import { useAddressBookList } from '@/services/addressBookService.js';

const {
  searchQuery,
  entries,
  isLoading,
  error,
  noEntriesMessage,
  fetchAllEntries,
  searchEntries
} = useAddressBookList();

onMounted(fetchAllEntries);
</script>

<template>
  <div class="min-h-screen bg-appBg p-6">
    <div class="max-w-4xl mx-auto bg-stone-50 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center py-6 text-headerText">
        Książka adresowa
      </h1>

      <div class="flex flex-wrap items-center gap-4 p-6">
        <div class="flex-1">
          <SearchBar
              v-model="searchQuery"
              placeholder="Szukaj po imieniu i nazwisku"
          />
        </div>
        <button
            class="px-4 py-2 bg-button text-white rounded shadow hover:bg-buttonHover"
            @click="searchEntries"
        >
          Szukaj
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-6">
        Ładowanie...
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-6">
        {{ error }}
      </div>

      <div v-else-if="noEntriesMessage" class="text-center py-6 text-gray-500">
        {{ noEntriesMessage }}
      </div>

      <AddressBookList
          v-else-if="entries.length"
          :entries="entries"
      />

      <div v-else class="text-center py-6">
        {{ searchQuery.trim() ? 'Brak wyników wyszukiwania' : 'Wprowadź imię lub nazwisko, aby wyszukać' }}
      </div>
    </div>
  </div>
</template>