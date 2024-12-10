<!-- AddressBook.vue (Główny komponent) -->
<script setup>
import { ref, watch } from 'vue';
import api from '@/axios.js';
import SearchBar from './components/SearchBar.vue';
import AddressBookList from './components/AddressBookList.vue';

// Stan wyszukiwania
const searchQuery = ref('');
const entries = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Funkcja do pobierania wpisów z backendu
const fetchEntries = async () => {
  // Jeśli zapytanie jest puste, nie wysyłaj requestu
  if (!searchQuery.value.trim()) {
    entries.value = [];
    return;
  }

  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get('/address-book/search', {
      params: { query: searchQuery.value }
    });

    entries.value = response.data;
  } catch (err) {
    error.value = 'Nie udało się załadować książki adresowej';
    console.error(err);
    entries.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Obserwator zmiany zapytania z debounce
watch(searchQuery, () => {
  // Użyj debounce, aby zmniejszyć liczbę zapytań
  const timeoutId = setTimeout(fetchEntries, 500);
  return () => clearTimeout(timeoutId);
});
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