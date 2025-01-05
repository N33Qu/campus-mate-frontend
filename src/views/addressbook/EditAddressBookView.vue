<script setup>
import SearchBar from './components/SearchBar.vue';
import AddressBookList from './components/AddressBookList.vue';
import {useAddressBookSearch} from "@/services/addressBookService.js";

const {
  searchQuery,
  entries,
  isLoading,
  error
} = useAddressBookSearch();
</script>

<template>
  <div class="min-h-screen bg-stone-700 p-6">
    <div class="max-w-4xl mx-auto bg-stone-50 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center py-6 text-stone-700">
        Książka adresowa
      </h1>

      <SearchBar
          v-model="searchQuery"
          placeholder="Szukaj po imieniu i nazwisku"
      />

      <div v-if="isLoading" class="text-center py-6">
        Ładowanie...
      </div>

      <div v-else-if="error" class="text-red-500 text-center py-6">
        {{ error }}
      </div>

      <AddressBookList
          v-else-if="entries.length"
          :entries="entries"
      />

      <div v-else class="text-center py-6 text-stone-500">
        {{ searchQuery.trim() ? 'Brak wyników wyszukiwania' : 'Wprowadź imię lub nazwisko, aby wyszukać' }}
      </div>
    </div>
  </div>
</template>